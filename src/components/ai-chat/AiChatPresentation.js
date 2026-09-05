import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { alpha, Box, ButtonBase, Stack, Typography } from "@mui/material";

export const aiChatEntrance = {
  animation: "aiChatEnter 220ms ease-out both",
  "@keyframes aiChatEnter": {
    from: { opacity: 0, transform: "translateY(6px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
    transition: "none",
  },
};

export const AiChatMark = ({ size = 44 }) => (
  <Box
    aria-hidden="true"
    sx={(theme) => ({
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: "32%",
      display: "grid",
      placeItems: "center",
      color: "#fff",
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, #537b91)`,
    })}
  >
    <AutoAwesomeRoundedIcon sx={{ fontSize: size * 0.5 }} />
  </Box>
);

export const AiChatWelcome = ({ greeting, intro, prompts, onPrompt }) => (
  <Stack
    spacing={2.5}
    sx={{ ...aiChatEntrance, maxWidth: 520, mx: "auto", py: { xs: 2, sm: 3 } }}
  >
    <AiChatMark size={60} />
    <Box>
      <Typography
        component="h2"
        variant="h5"
        fontWeight={700}
        sx={{ lineHeight: 1.35 }}
      >
        {greeting}
      </Typography>
      <Typography
        color="var(--ai-chat-muted, #596A75)"
        sx={{ mt: 1.25, lineHeight: 1.65, fontSize: 14 }}
      >
        {intro}
      </Typography>
    </Box>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
        gap: 1.25,
      }}
    >
      {prompts.map((prompt) => (
        <ButtonBase
          key={prompt.label}
          onClick={() => onPrompt(prompt.label)}
          sx={(theme) => ({
            p: 1.75,
            gap: 1.5,
            textAlign: "start",
            justifyContent: "flex-start",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "18px",
            bgcolor: "background.paper",
            transition: "border-color 160ms, background-color 160ms",
            "&:hover, &.Mui-focusVisible": {
              borderColor: "primary.main",
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            },
          })}
        >
          <Box
            sx={(theme) => ({
              display: "grid",
              placeItems: "center",
              width: 38,
              height: 38,
              flexShrink: 0,
              borderRadius: "12px",
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: "primary.main",
              "& svg": { fontSize: 20 },
            })}
          >
            {prompt.icon}
          </Box>
          <Box minWidth={0} flex={1}>
            <Typography fontSize={13} fontWeight={600} sx={{ lineHeight: 1.5 }}>
              {prompt.label}
            </Typography>
            <Typography
              fontSize={12}
              color="var(--ai-chat-muted, #596A75)"
              sx={{ mt: 0.5, lineHeight: 1.5 }}
            >
              {prompt.hint}
            </Typography>
          </Box>
          <ArrowForwardRoundedIcon
            sx={{ fontSize: 16, color: "primary.main" }}
          />
        </ButtonBase>
      ))}
    </Box>
  </Stack>
);

export const AiChatTyping = ({ label }) => (
  <Stack
    role="status"
    direction="row"
    alignItems="center"
    spacing={1.25}
    sx={{ py: 1.5 }}
  >
    <AiChatMark size={30} />
    <Stack aria-hidden="true" direction="row" spacing={0.5}>
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: 6,
            height: 6,
            bgcolor: "primary.main",
            borderRadius: "50%",
            animation: "aiChatDot 1200ms ease-in-out infinite",
            animationDelay: `${index * 160}ms`,
            "@keyframes aiChatDot": {
              "0%, 100%": { opacity: 0.35 },
              "50%": { opacity: 1 },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />
      ))}
    </Stack>
    <Typography variant="caption" color="var(--ai-chat-muted, #596A75)">
      {label}
    </Typography>
  </Stack>
);
