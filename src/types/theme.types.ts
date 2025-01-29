export interface Theme {
  colors: {
    background: {
      primary: string;
      secondary: string;
      card: string;
      hover: string;
      active: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    accent: {
      primary: string;
      secondary: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
    };
    border: string;
  };
} 