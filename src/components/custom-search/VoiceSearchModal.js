import React from "react";
import {
  Box,
  IconButton,
  Typography,
  styled,
  keyframes,
  alpha,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import CustomModal from "../custom-component/CustomModal";
import i18next, { t } from "i18next";

const LISTENING_TIMEOUT_MS = 12000;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 ${alpha("#00B562", 0.4)}; }
  70% { box-shadow: 0 0 0 20px ${alpha("#00B562", 0)}; }
  100% { box-shadow: 0 0 0 0 ${alpha("#00B562", 0)}; }
`;

const ModalContent = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: "40px 60px",
  textAlign: "center",
  width: "100%",
  maxWidth: "500px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "30px",
  minHeight: "300px",
  minWidth: "300px",
  [theme.breakpoints.down("sm")]: {
    padding: "20px 25px",
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: theme.palette.neutral[200],
  padding: "5px",
  "&:hover": {
    backgroundColor: theme.palette.neutral[300],
  },
}));

const MicButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "listening",
})(({ theme, listening }) => ({
  width: "64px",
  height: "64px",
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  animation: listening ? `${pulse} 2s infinite` : "none",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  "&.Mui-disabled": {
    color: alpha(theme.palette.common.white, 0.7),
    backgroundColor: alpha(theme.palette.primary.main, 0.45),
  },
}));

const getSpeechLanguage = () => {
  const storedLanguage =
    typeof window !== "undefined" ? localStorage.getItem("language") : "";
  const language = (storedLanguage || i18next.language || "").toLowerCase();

  if (language.startsWith("ka") || language.startsWith("ge")) return "ka-GE";
  if (language.startsWith("ru")) return "ru-RU";
  return "en-US";
};

const VoiceSearchModal = ({ open, handleClose, onResult }) => {
  const theme = useTheme();
  const [status, setStatus] = React.useState("idle");
  const [transcript, setTranscript] = React.useState("");
  const recognitionRef = React.useRef(null);
  const timeoutRef = React.useRef(null);
  const callbacksRef = React.useRef({ handleClose, onResult });
  const isListening = status === "listening";

  React.useEffect(() => {
    callbacksRef.current = { handleClose, onResult };
  }, [handleClose, onResult]);

  const clearListeningTimeout = React.useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const abortRecognition = React.useCallback(() => {
    clearListeningTimeout();
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.abort();
    } catch (_) {}
  }, [clearListeningTimeout]);

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("unsupported");
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setTranscript("");
      setStatus("listening");
    };
    recognition.onresult = (event) => {
      const result = Array.from(event.results)
        .map((item) => item?.[0]?.transcript || "")
        .join(" ")
        .trim();
      setTranscript(result);

      if (result && Array.from(event.results).some((item) => item.isFinal)) {
        clearListeningTimeout();
        callbacksRef.current.onResult(result);
        callbacksRef.current.handleClose();
      }
    };
    recognition.onnomatch = () => {
      clearListeningTimeout();
      setStatus("no-match");
    };
    recognition.onerror = (event) => {
      clearListeningTimeout();
      if (event.error === "aborted") return;
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setStatus("permission-denied");
        return;
      }
      if (event.error === "no-speech") {
        setStatus("no-match");
        return;
      }
      setStatus("error");
    };
    recognition.onend = () => {
      clearListeningTimeout();
      setStatus((currentStatus) =>
        currentStatus === "listening" ? "idle" : currentStatus
      );
    };

    return () => {
      clearListeningTimeout();
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onnomatch = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch (_) {}
      recognitionRef.current = null;
    };
  }, [clearListeningTimeout]);

  React.useEffect(() => {
    if (open) {
      setTranscript("");
      setStatus(recognitionRef.current ? "idle" : "unsupported");
    } else {
      abortRecognition();
    }
  }, [abortRecognition, open]);

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    recognitionRef.current.lang = getSpeechLanguage();
    setStatus("starting");
    try {
      recognitionRef.current.start();
      clearListeningTimeout();
      timeoutRef.current = window.setTimeout(() => {
        try {
          recognitionRef.current?.abort();
        } catch (_) {}
        setStatus("timeout");
      }, LISTENING_TIMEOUT_MS);
    } catch (error) {
      setStatus(error?.name === "InvalidStateError" ? "listening" : "error");
    }
  };

  const closeModal = () => {
    abortRecognition();
    handleClose();
  };

  const helperText = () => {
    if (status === "unsupported") {
      return t("Voice search is not supported in this browser.");
    }
    if (status === "permission-denied") {
      return t("Microphone Access Required");
    }
    if (status === "no-match" || status === "timeout") {
      return t("We could not hear you. Tap the microphone and try again.");
    }
    if (status === "error") {
      return t("Voice search is temporarily unavailable. Please try again.");
    }
    if (isListening) return t("Tell me what you're looking for......");
    return t("Tap the microphone to start voice search.");
  };

  return (
    <CustomModal openModal={open} setModalOpen={closeModal}>
      <ModalContent>
        <CloseButton onClick={closeModal} aria-label={t("Close")}>
          <CloseIcon sx={{ fontSize: "16px", color: theme.palette.neutral[600] }} />
        </CloseButton>
        <Typography
          fontSize="16px"
          sx={{
            fontWeight: 400,
            color:
              status === "permission-denied" || status === "error"
                ? theme.palette.error.main
                : theme.palette.neutral[600],
          }}
        >
          {transcript || helperText()}
        </Typography>
        <MicButton
          listening={isListening}
          onClick={startListening}
          disabled={status === "unsupported" || status === "starting"}
          aria-label={t("Start voice search")}
        >
          <MicIcon sx={{ fontSize: "30px" }} />
        </MicButton>
        {status === "permission-denied" && (
          <Typography variant="body2" color="text.secondary">
            {t(
              "Enable microphone permission in your browser settings, then try again."
            )}
          </Typography>
        )}
      </ModalContent>
    </CustomModal>
  );
};

export default VoiceSearchModal;
