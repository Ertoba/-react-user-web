import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import MainApi from "../../api-manage/MainApi";
import { ai_chat_send_api } from "../../api-manage/ApiRoutes";

const supportedModules = new Set(["food", "grocery", "ecommerce", "pharmacy"]);
const knownErrors = new Set([
  "ai_chat_disabled",
  "ai_chat_daily_limit_reached",
  "ai_chat_temporarily_unavailable",
]);

const isEnabled = (value) => value === true || value === 1 || value === "1";

const getCachedModule = () => {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem("module"));
  } catch {
    return null;
  }
};

const CustomerAiChat = ({ configData }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const endRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { profileInfo } = useSelector((state) => state.profileInfo);

  useEffect(() => {
    setHasToken(Boolean(localStorage.getItem("token")));
  }, [router.asPath, profileInfo]);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, sending]);

  const moduleType = (selectedModule ?? getCachedModule())?.module_type;
  const canUseChat =
    isEnabled(configData?.ai_chat_status) &&
    hasToken &&
    supportedModules.has(moduleType);

  const requestHistory = useMemo(
    () =>
      messages
        .filter((message) => message.role === "user" || message.role === "assistant")
        .slice(-10)
        .map(({ role, content }) => ({ role, content })),
    [messages]
  );

  if (!canUseChat) return null;

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || sending) return;

    const userMessage = { role: "user", content };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setSending(true);

    try {
      const response = await MainApi.post(ai_chat_send_api, {
        message: content,
        history: requestHistory,
      });
      const reply = String(response?.data?.message ?? "").trim();
      if (!reply) throw new Error("Empty AI response");

      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch (error) {
      const responseKey = error?.response?.data?.message;
      const errorKey = knownErrors.has(responseKey)
        ? responseKey
        : "ai_chat_temporarily_unavailable";
      setMessages((current) => [
        ...current,
        { role: "error", content: t(errorKey) },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Tooltip title={t("AI_Chat_Assistant")} placement="left">
        <IconButton
          aria-label={t("AI_Chat_Assistant")}
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            right: { xs: 16, sm: 24 },
            bottom: { xs: 82, sm: 24 },
            zIndex: theme.zIndex.speedDial,
            width: 52,
            height: 52,
            color: theme.palette.primary.contrastText,
            bgcolor: theme.palette.primary.main,
            boxShadow: theme.shadows[4],
            "&:hover": { bgcolor: theme.palette.primary.dark },
          }}
        >
          <AutoAwesomeOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isMobile}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: { xs: 0, sm: "8px" } } }}
      >
        <DialogTitle sx={{ pr: 7, py: 2 }}>
          <Typography component="span" variant="h6" fontWeight={700}>
            {t("AI_Chat_Assistant")}
          </Typography>
          <IconButton
            aria-label={t("Close")}
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 12, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ minHeight: { xs: 0, sm: 420 }, p: 2 }}>
          {messages.length === 0 ? (
            <Typography color="text.secondary" variant="body2" sx={{ py: 4 }}>
              {t("AI_Chat_Assistant_read_only_hint")}
            </Typography>
          ) : (
            <Stack spacing={1.25}>
              {messages.map((message, index) => {
                const isUser = message.role === "user";
                const isError = message.role === "error";
                return (
                  <Box
                    key={`${message.role}-${index}`}
                    sx={{
                      alignSelf: isUser ? "flex-end" : "flex-start",
                      maxWidth: "88%",
                      px: 1.5,
                      py: 1,
                      borderRadius: "8px",
                      color: isError
                        ? theme.palette.error.main
                        : isUser
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.primary,
                      bgcolor: isError
                        ? theme.palette.error.lighter ?? theme.palette.action.hover
                        : isUser
                          ? theme.palette.primary.main
                          : theme.palette.action.hover,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <Typography variant="body2">{message.content}</Typography>
                  </Box>
                );
              })}
              {sending && (
                <Typography color="text.secondary" variant="body2">
                  {t("AI_Chat_Assistant")}...
                </Typography>
              )}
              <span ref={endRef} />
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 1.5, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            disabled={sending}
            inputProps={{ maxLength: 1000 }}
            placeholder={t("Type Here")}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
          />
          <Tooltip title={t("Send")}>
            <span>
              <IconButton
                color="primary"
                aria-label={t("Send")}
                disabled={!input.trim() || sending}
                onClick={sendMessage}
                sx={{ width: 44, height: 44 }}
              >
                <SendRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomerAiChat;
