import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import {
  alpha,
  Avatar,
  Box,
  Chip,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Slide,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import MainApi from "../../api-manage/MainApi";
import { ai_chat_send_api } from "../../api-manage/ApiRoutes";
import { getProductRedirectURL } from "../../helper-functions/handleProductRedirect";
import { getStoreRedirectURL } from "../../helper-functions/handleStoreRedirect";
import AiChatResultSections from "./AiChatResultSections";
import {
  AiChatMark,
  AiChatWelcome,
  AiChatTyping,
  aiChatEntrance,
} from "./AiChatPresentation";
import Chatting from "../chat/Chatting";

const supportedModules = new Set(["food", "grocery", "ecommerce", "pharmacy"]);
const knownErrors = new Set([
  "ai_chat_disabled",
  "ai_chat_daily_limit_reached",
  "ai_chat_temporarily_unavailable",
]);
const archiveAfterMs = 60 * 60 * 1000;
const maxConversations = 20;
const maxMessages = 50;

const SheetTransition = forwardRef(function SheetTransition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const isEnabled = (value) => value === true || value === 1 || value === "1";

const getCachedModule = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("module"));
  } catch {
    return null;
  }
};

const newConversation = () => {
  const now = Date.now();
  return {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
    archived: false,
    messages: [],
  };
};

const normalizeConversations = (items) => {
  const now = Date.now();
  return (Array.isArray(items) ? items : [])
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      ...item,
      archived:
        Boolean(item.archived) ||
        now - Number(item.updatedAt || 0) >= archiveAfterMs,
      messages: Array.isArray(item.messages)
        ? item.messages.slice(-maxMessages)
        : [],
    }))
    .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
    .slice(0, maxConversations);
};

const linkPattern =
  /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)/g;

const LinkifiedText = ({ text }) => {
  const source = String(text);
  const parts = [];
  let cursor = 0;
  let match;

  while ((match = linkPattern.exec(source)) !== null) {
    if (match.index > cursor) {
      parts.push(source.slice(cursor, match.index));
    }

    const label = match[1];
    let href = match[2] || match[3];
    let trailingPunctuation = "";

    if (!match[2]) {
      const trailingMatch = href.match(/[),.!?;:]+$/);
      if (trailingMatch) {
        trailingPunctuation = trailingMatch[0];
        href = href.slice(0, -trailingPunctuation.length);
      }
    }

    parts.push(
      <Link
        key={`${match.index}-${href}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
        underline="always"
      >
        {label || href}
      </Link>
    );
    if (trailingPunctuation) parts.push(trailingPunctuation);
    cursor = linkPattern.lastIndex;
  }

  if (cursor < source.length) parts.push(source.slice(cursor));

  return <>{parts}</>;
};

const CustomerAiChat = ({ configData }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const endRef = useRef(null);
  const nearBottomRef = useRef(true);
  const inputRef = useRef(null);
  const [showLatest, setShowLatest] = useState(false);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [operatorMode, setOperatorMode] = useState(false);
  const [operatorTranscript, setOperatorTranscript] = useState("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [storageReady, setStorageReady] = useState(false);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { profileInfo } = useSelector((state) => state.profileInfo);

  const accountKey = useMemo(() => {
    const identity = profileInfo?.id || profileInfo?.email;
    return identity ? `mili_web_ai_chat_${identity}` : null;
  }, [profileInfo?.email, profileInfo?.id]);

  useEffect(() => {
    setHasToken(Boolean(localStorage.getItem("token")));
  }, [router.asPath, profileInfo]);

  useEffect(() => {
    setStorageReady(false);
    if (!accountKey) {
      setConversations([]);
      setActiveId(null);
      return;
    }
    try {
      const saved = normalizeConversations(
        JSON.parse(localStorage.getItem(accountKey) || "[]")
      );
      const active = saved.find((item) => !item.archived) || null;
      setConversations(saved);
      setActiveId(active?.id || null);
    } catch {
      setConversations([]);
      setActiveId(null);
    } finally {
      setStorageReady(true);
    }
  }, [accountKey]);

  useEffect(() => {
    if (!storageReady || !accountKey) return;
    localStorage.setItem(accountKey, JSON.stringify(conversations));
  }, [accountKey, conversations, storageReady]);

  useEffect(() => {
    const archiveExpired = () => {
      const normalized = normalizeConversations(conversations);
      const changed = normalized.some(
        (item, index) => item.archived !== conversations[index]?.archived
      );
      if (changed) {
        setConversations(normalized);
        const active = normalized.find((item) => item.id === activeId);
        if (active?.archived) setActiveId(null);
      }
    };
    archiveExpired();
    const timer = window.setInterval(archiveExpired, 30000);
    return () => window.clearInterval(timer);
  }, [activeId, conversations]);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId) || null,
    [activeId, conversations]
  );
  const messages = useMemo(
    () => activeConversation?.messages || [],
    [activeConversation]
  );
  const archived = Boolean(activeConversation?.archived);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      if (nearBottomRef.current)
        endRef.current?.scrollIntoView({ block: "end" });
      else setShowLatest(true);
    }, 90);
    return () => window.clearTimeout(timer);
  }, [messages, open, sending, showHistory]);

  const moduleType = (selectedModule ?? getCachedModule())?.module_type;
  const canUseChat =
    isEnabled(configData?.ai_chat_status) &&
    hasToken &&
    Boolean(accountKey) &&
    supportedModules.has(moduleType);

  const requestHistory = useMemo(
    () =>
      messages
        .filter(
          (message) => message.role === "user" || message.role === "assistant"
        )
        .slice(-10)
        .map(({ role, content }) => ({ role, content })),
    [messages]
  );

  const updateConversation = (id, updater) => {
    setConversations((current) =>
      normalizeConversations(
        current.map((conversation) =>
          conversation.id === id ? updater(conversation) : conversation
        )
      )
    );
  };

  const ensureActiveConversation = () => {
    if (activeConversation && !activeConversation.archived) {
      return activeConversation.id;
    }
    const conversation = newConversation();
    setConversations((current) => [
      conversation,
      ...normalizeConversations(current),
    ]);
    setActiveId(conversation.id);
    return conversation.id;
  };

  const startNewChat = () => {
    const conversation = newConversation();
    setConversations((current) => [
      conversation,
      ...normalizeConversations(current),
    ]);
    setActiveId(conversation.id);
    setShowHistory(false);
    setInput("");
    nearBottomRef.current = true;
    setShowLatest(false);
    inputRef.current?.focus();
  };

  const deleteConversation = (id) => {
    setConversations((current) => current.filter((item) => item.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const sendMessage = async (suggestedContent) => {
    const content = String(suggestedContent ?? input).trim();
    if (!content || sending || archived) return;

    const conversationId = ensureActiveConversation();
    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
    };
    updateConversation(conversationId, (conversation) => ({
      ...conversation,
      updatedAt: Date.now(),
      messages: [...conversation.messages, userMessage].slice(-maxMessages),
    }));
    setInput("");
    nearBottomRef.current = true;
    setShowLatest(false);
    setSending(true);

    try {
      const response = await MainApi.post(ai_chat_send_api, {
        message: content,
        history: requestHistory,
      });
      const reply = String(response?.data?.message ?? "").trim();
      if (!reply) throw new Error("Empty AI response");

      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        updatedAt: Date.now(),
        messages: [
          ...conversation.messages,
          {
            id: `${Date.now()}-assistant`,
            role: "assistant",
            content: reply,
            metadata:
              response?.data?.metadata &&
              typeof response.data.metadata === "object"
                ? response.data.metadata
                : {},
          },
        ].slice(-maxMessages),
      }));
    } catch (error) {
      const responseKey = error?.response?.data?.message;
      const errorKey = knownErrors.has(responseKey)
        ? responseKey
        : "ai_chat_temporarily_unavailable";
      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        updatedAt: Date.now(),
        messages: [
          ...conversation.messages,
          {
            id: `${Date.now()}-error`,
            role: "error",
            content: t(errorKey),
          },
        ].slice(-maxMessages),
      }));
    } finally {
      setSending(false);
    }
  };

  const askAbout = (name) => {
    if (name) sendMessage(`${t("Search")}: ${name}`);
  };

  const openProduct = (product) => {
    const id = Number(product?.id);
    if (!Number.isInteger(id) || id <= 0) return;
    setOpen(false);
    router.push(getProductRedirectURL(product));
  };

  const openStore = (store) => {
    const id = Number(store?.id);
    if (!Number.isInteger(id) || id <= 0) return;
    setOpen(false);
    router.push(getStoreRedirectURL(store, undefined, router.query));
  };

  const openOperatorChat = () => {
    const transcript = messages
      .filter(
        (message) => message.role === "user" || message.role === "assistant"
      )
      .slice(-10)
      .map(
        (message) =>
          `${
            message.role === "user" ? profileInfo?.f_name || "Customer" : "AI"
          }: ${message.content}`
      )
      .join("\n");
    setOperatorTranscript(
      transcript ? `AI support handoff context:\n${transcript}` : ""
    );
    setShowHistory(false);
    setOperatorMode(true);
  };

  if (!canUseChat) return null;

  const quickPrompts = [
    {
      label: t("Most Popular Items"),
      icon: <StarRoundedIcon />,
      hint: t("ai_chat_ui_popular_hint"),
    },
    {
      label: t("Discounted Items"),
      icon: <LocalOfferOutlinedIcon />,
      hint: t("ai_chat_ui_deals_hint"),
    },
    {
      label: t("Popular Stores"),
      icon: <StorefrontOutlinedIcon />,
      hint: t("ai_chat_ui_stores_hint"),
    },
    {
      label: t("Categories"),
      icon: <CategoryOutlinedIcon />,
      hint: t("ai_chat_ui_categories_hint"),
    },
  ];

  return (
    <>
      <Tooltip title={t("AI_Chat_Assistant")} placement="left">
        <IconButton
          aria-label={t("AI_Chat_Assistant")}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => {
            nearBottomRef.current = true;
            setShowLatest(false);
            setOpen(true);
          }}
          sx={{
            position: "fixed",
            right: { xs: 16, sm: 24 },
            bottom: { xs: 82, sm: 24 },
            zIndex: theme.zIndex.speedDial,
            width: 56,
            height: 56,
            p: 0,
            borderRadius: "18px",
            color: "primary.contrastText",
            bgcolor: "primary.main",
            boxShadow: theme.shadows[4],
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          <AiChatMark size={56} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        aria-labelledby="mili-ai-chat-title"
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        TransitionComponent={SheetTransition}
        transitionDuration={reduceMotion ? 0 : { enter: 300, exit: 220 }}
        keepMounted
        sx={{
          "& .MuiDialog-container": {
            alignItems: isMobile ? "flex-end" : "center",
          },
        }}
        PaperProps={{
          sx: {
            "--ai-chat-muted":
              theme.palette.mode === "dark" ? "#B8C4CE" : "#596A75",
            "--ai-chat-accent":
              theme.palette.mode === "dark" ? "#77DAB1" : "#167449",
            m: { xs: 0, sm: 2 },
            width: { xs: "100%", sm: "min(100% - 32px, 680px)" },
            height: { xs: "94dvh", sm: 680 },
            maxHeight: { xs: "94dvh", sm: "calc(100dvh - 48px)" },
            borderRadius: { xs: "28px 28px 0 0", sm: "28px" },
            overflow: "hidden",
            "@media (prefers-reduced-motion: reduce)": {
              "&, & *": {
                animation: "none !important",
                transition: "none !important",
              },
            },
          },
        }}
      >
        <DialogTitle component="div" sx={{ px: 2, pt: 1.25, pb: 1 }}>
          {isMobile && (
            <Box
              aria-hidden="true"
              sx={{
                width: 32,
                height: 4,
                mx: "auto",
                mb: 1.5,
                bgcolor: "divider",
                borderRadius: 4,
              }}
            />
          )}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {operatorMode ? (
              <Avatar
                sx={{
                  color: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <SupportAgentOutlinedIcon />
              </Avatar>
            ) : (
              <AiChatMark />
            )}
            <Box minWidth={0} flex={1}>
              <Typography
                id="mili-ai-chat-title"
                component="h2"
                variant="subtitle1"
                fontWeight={700}
                sx={{ lineHeight: 1.5 }}
              >
                {operatorMode ? t("Support Operator") : t("AI_Chat_Assistant")}
              </Typography>
              <Typography
                variant="caption"
                color="var(--ai-chat-muted, #596A75)"
              >
                {operatorMode ? t("Human support") : t("ai_chat_ui_subtitle")}
              </Typography>
            </Box>
            <IconButton
              aria-label={t("Close")}
              onClick={() => setOpen(false)}
              sx={{ width: 44, height: 44 }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              mt: 1,
              overflowX: "auto",
              "& .MuiButton-root": {
                flexShrink: 0,
                minHeight: 44,
                fontSize: 12,
                px: 1,
                color: "var(--ai-chat-accent)",
                textTransform: "none",
              },
            }}
          >
            {!operatorMode ? (
              <>
                <Button
                  disabled={sending}
                  startIcon={<AddCommentOutlinedIcon />}
                  onClick={startNewChat}
                >
                  {t("New Chat")}
                </Button>
                <Button
                  startIcon={<HistoryRoundedIcon />}
                  aria-expanded={showHistory}
                  aria-controls="mili-ai-chat-history"
                  onClick={() => setShowHistory((value) => !value)}
                  sx={{ bgcolor: showHistory ? "action.selected" : undefined }}
                >
                  {t("ai_chat_ui_history")}
                </Button>
                <Button
                  startIcon={<SupportAgentOutlinedIcon />}
                  onClick={openOperatorChat}
                >
                  {t("ai_chat_ui_support")}
                </Button>
              </>
            ) : (
              <Button
                startIcon={<AutoAwesomeOutlinedIcon />}
                onClick={() => setOperatorMode(false)}
              >
                {t("AI_Chat_Assistant")}
              </Button>
            )}
          </Stack>
        </DialogTitle>
        <Divider />

        <Collapse
          id="mili-ai-chat-history"
          in={!operatorMode && showHistory}
          timeout={reduceMotion ? 0 : 220}
        >
          <Box
            sx={{
              maxHeight: "min(220px, 30dvh)",
              overflowY: "auto",
              bgcolor: "background.paper",
            }}
          >
            <Stack direction="row" alignItems="center" sx={{ px: 2, pt: 1.25 }}>
              <Typography variant="subtitle2" fontWeight={700} flex={1}>
                {t("See Chat History")}
              </Typography>
              <Chip
                size="small"
                icon={<AddCommentOutlinedIcon />}
                label={t("New Chat")}
                color="primary"
                variant="outlined"
                onClick={sending ? undefined : startNewChat}
              />
            </Stack>
            {conversations.length === 0 ? (
              <Typography
                color="var(--ai-chat-muted, #596A75)"
                variant="body2"
                sx={{ p: 2 }}
              >
                {t("No chat history")}
              </Typography>
            ) : (
              <List dense disablePadding sx={{ py: 0.75 }}>
                {conversations.map((conversation) => {
                  const firstMessage = conversation.messages.find(
                    (message) => message.role === "user"
                  );
                  return (
                    <ListItemButton
                      key={conversation.id}
                      selected={conversation.id === activeId}
                      onClick={() => {
                        nearBottomRef.current = true;
                        setShowLatest(false);
                        setActiveId(conversation.id);
                        setShowHistory(false);
                      }}
                      sx={{ px: 2 }}
                    >
                      <ListItemText
                        primary={firstMessage?.content || t("New Chat")}
                        secondary={
                          conversation.archived
                            ? t("Archived")
                            : new Date(conversation.updatedAt).toLocaleString()
                        }
                        primaryTypographyProps={{ noWrap: true }}
                      />
                      <Tooltip title={t("Delete")}>
                        <IconButton
                          edge="end"
                          aria-label={t("Delete")}
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteConversation(conversation.id);
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItemButton>
                  );
                })}
              </List>
            )}
          </Box>
          <Divider />
        </Collapse>

        <DialogContent
          onScroll={(event) => {
            const node = event.currentTarget;
            nearBottomRef.current =
              node.scrollHeight - node.scrollTop - node.clientHeight < 80;
            setShowLatest(!nearBottomRef.current);
          }}
          sx={{
            minHeight: 0,
            flex: 1,
            p: operatorMode ? 0 : 2,
            overflowY: operatorMode ? "hidden" : "auto",
            overscrollBehavior: "contain",
            bgcolor: alpha(theme.palette.background.default, 0.45),
          }}
        >
          {operatorMode ? (
            <Chatting
              configData={configData}
              embedded
              initialMessage={operatorTranscript}
            />
          ) : messages.length === 0 ? (
            <AiChatWelcome
              greeting={
                profileInfo?.f_name
                  ? `${t("Hello")}, ${profileInfo.f_name}`
                  : t("AI_Chat_Assistant")
              }
              intro={t("ai_chat_ui_intro")}
              prompts={quickPrompts}
              onPrompt={sendMessage}
            />
          ) : (
            <Stack
              role="log"
              aria-label={t("AI_Chat_Assistant")}
              aria-live="polite"
              aria-relevant="additions"
              spacing={2}
            >
              {messages.map((message, index) => {
                const isUser = message.role === "user";
                const isError = message.role === "error";
                return (
                  <Box
                    key={message.id || `${message.role}-${index}`}
                    sx={{
                      ...aiChatEntrance,
                      alignSelf: isUser ? "flex-end" : "stretch",
                      maxWidth: isUser ? "88%" : "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: "fit-content",
                        maxWidth: "100%",
                        ml: isUser ? "auto" : 0,
                        px: 2,
                        py: 1.5,
                        border: isUser ? 0 : 1,
                        borderColor: isError ? "error.light" : "divider",
                        borderRadius: isUser
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                        color: isError
                          ? "error.main"
                          : isUser
                          ? "primary.contrastText"
                          : "text.primary",
                        bgcolor: isUser ? "primary.main" : "background.paper",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                        <LinkifiedText text={message.content} />
                      </Typography>
                    </Box>
                    {!isUser && !isError && (
                      <AiChatResultSections
                        metadata={message.metadata}
                        onAskAbout={askAbout}
                        onOpenProduct={openProduct}
                        onOpenStore={openStore}
                      />
                    )}
                  </Box>
                );
              })}
              {sending && <AiChatTyping label={t("Preparing a response...")} />}
              <span ref={endRef} />
            </Stack>
          )}
        </DialogContent>
        {!operatorMode && messages.length > 0 && showLatest && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 0.5,
              bgcolor: "background.paper",
            }}
          >
            <Button
              size="small"
              startIcon={<ArrowDownwardRoundedIcon />}
              onClick={() => {
                nearBottomRef.current = true;
                setShowLatest(false);
                endRef.current?.scrollIntoView({
                  block: "end",
                  behavior: reduceMotion ? "auto" : "smooth",
                });
              }}
            >
              {t("ai_chat_ui_latest")}
            </Button>
          </Box>
        )}

        {!operatorMode && archived ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{ p: 1.5 }}
          >
            <Typography
              color="var(--ai-chat-muted, #596A75)"
              variant="body2"
              flex={1}
            >
              {t("Archived chats are read-only. Start a new chat to continue.")}
            </Typography>
            <Tooltip title={t("New Chat")}>
              <IconButton
                color="primary"
                aria-label={t("New Chat")}
                onClick={startNewChat}
              >
                <AddCommentOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : !operatorMode ? (
          <DialogActions
            sx={{
              p: 2,
              pt: 1.5,
              pb: "max(12px, env(safe-area-inset-bottom))",
              display: "block",
              bgcolor: "background.paper",
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              alignItems="flex-end"
              sx={{
                p: 0.75,
                borderRadius: "24px",
                border: 1,
                borderColor: "divider",
                bgcolor: "background.default",
                "&:focus-within": { borderColor: "primary.main" },
              }}
            >
              <TextField
                fullWidth
                multiline
                maxRows={4}
                variant="standard"
                inputRef={inputRef}
                value={input}
                inputProps={{
                  maxLength: 1000,
                  "aria-label": t("ai_chat_ui_placeholder"),
                }}
                InputProps={{ disableUnderline: true }}
                placeholder={t("ai_chat_ui_placeholder")}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing &&
                    event.keyCode !== 229
                  ) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                sx={{
                  "& textarea::placeholder": {
                    color: "var(--ai-chat-muted)",
                    opacity: 1,
                  },
                  "& .MuiInputBase-root": {
                    px: 1.5,
                    py: 1.25,
                    fontSize: 14,
                    lineHeight: 1.5,
                  },
                }}
              />
              <Tooltip title={t("Send")}>
                <span>
                  <IconButton
                    aria-label={t("Send")}
                    disabled={!input.trim() || sending}
                    onClick={() => {
                      sendMessage();
                      inputRef.current?.focus();
                    }}
                    sx={{
                      width: 48,
                      height: 48,
                      color: "primary.contrastText",
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                      "&.Mui-disabled": {
                        bgcolor: "action.disabledBackground",
                      },
                    }}
                  >
                    <ArrowUpwardRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
            <Typography
              variant="caption"
              color="var(--ai-chat-muted, #596A75)"
              align="center"
              display="block"
              sx={{ mt: 1, fontSize: 11, lineHeight: 1.5 }}
            >
              {t("ai_chat_ui_footer")}
            </Typography>
          </DialogActions>
        ) : null}
      </Dialog>
    </>
  );
};

export default CustomerAiChat;
