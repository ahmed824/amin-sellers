import { useState, useEffect } from 'react';
import { Button, Box, useMediaQuery, useTheme, Snackbar, Alert } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import ShareIcon from '@mui/icons-material/Share';

const InstallButton = ({ showInSidebar = false }) => {
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSafari, setIsSafari] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Detect Safari browser and check installation status
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isSafariBrowser = /Safari/.test(userAgent) && !/Chrome|CriOS/.test(userAgent);
    setIsSafari(isSafariBrowser);

    // Immediate check for installation status
    const checkInstallationStatus = () => {
      // Check if running in standalone mode
      if (window.navigator.standalone === true || 
          window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Safari: App detected as installed');
        setIsInstalled(true);
        localStorage.setItem('app-installed', 'true');
        return true;
      }
      return false;
    };

    // Run initial check
    checkInstallationStatus();

    // Set up a periodic check every 5 seconds for Safari
    if (isSafariBrowser) {
      const periodicCheck = setInterval(() => {
        if (checkInstallationStatus()) {
          clearInterval(periodicCheck);
        }
      }, 5000);

      // Clean up after 2 minutes
      const cleanupTimer = setTimeout(() => {
        clearInterval(periodicCheck);
      }, 120000);

      return () => {
        clearInterval(periodicCheck);
        clearTimeout(cleanupTimer);
      };
    }
  }, []);

  // Check if app is already installed
  useEffect(() => {
    // Check if running in standalone mode (PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      localStorage.setItem('app-installed', 'true');
      return;
    }

    // Check localStorage for installation status
    const installStatus = localStorage.getItem('app-installed');
    if (installStatus === 'true') {
      setIsInstalled(true);
      return;
    }

    // For Safari, check if app was previously installed
    if (isSafari) {
      // Check if we're in standalone mode (Safari PWA)
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        localStorage.setItem('app-installed', 'true');
        return;
      }
      
      // Check for Safari-specific installation indicators
      const safariInstallCheck = () => {
        // Check if we're running in standalone mode
        if (window.navigator.standalone === true || 
            window.matchMedia('(display-mode: standalone)').matches) {
          setIsInstalled(true);
          localStorage.setItem('app-installed', 'true');
          return true;
        }
        return false;
      };

      // Initial check
      if (!safariInstallCheck()) {
        setShowInstallButton(true);
      }

      // Set up periodic check for Safari installation
      const safariCheckInterval = setInterval(() => {
        if (safariInstallCheck()) {
          clearInterval(safariCheckInterval);
        }
      }, 1000);

      // Clean up interval after 30 seconds
      const cleanupTimer = setTimeout(() => {
        clearInterval(safariCheckInterval);
      }, 30000);

      return () => {
        clearInterval(safariCheckInterval);
        clearTimeout(cleanupTimer);
      };
    }

    // For other browsers, listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isSafari]);

  // Listen for app installation
  useEffect(() => {
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      localStorage.setItem('app-installed', 'true');
      setSnackbarMessage('تم تثبيت التطبيق بنجاح!');
      setShowSnackbar(true);
    };

    // Handle page visibility changes (useful for Safari)
    const handleVisibilityChange = () => {
      if (!document.hidden && isSafari) {
        // Check if app is now in standalone mode when page becomes visible
        setTimeout(() => {
          if (window.navigator.standalone === true || 
              window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            setShowInstallButton(false);
            localStorage.setItem('app-installed', 'true');
            setSnackbarMessage('تم تثبيت التطبيق بنجاح!');
            setShowSnackbar(true);
          }
        }, 100);
      }
    };

    // Handle window focus (useful for Safari)
    const handleWindowFocus = () => {
      if (isSafari) {
        // Check if app is now in standalone mode when window gains focus
        setTimeout(() => {
          if (window.navigator.standalone === true || 
              window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            setShowInstallButton(false);
            localStorage.setItem('app-installed', 'true');
            setSnackbarMessage('تم تثبيت التطبيق بنجاح!');
            setShowSnackbar(true);
          }
        }, 100);
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [isSafari]);

  const handleInstallClick = async () => {
    if (isSafari) {
      // Show Safari-specific instructions
      setSnackbarMessage('اضغط على زر المشاركة في Safari، ثم اختر "إضافة إلى الشاشة الرئيسية"');
      setShowSnackbar(true);
      
      // Track that user has seen the install instructions
      localStorage.setItem('safari-install-shown', 'true');
      
      // Set up a more frequent check for Safari installation
      const safariInstallCheck = () => {
        if (window.navigator.standalone === true || 
            window.matchMedia('(display-mode: standalone)').matches) {
          setIsInstalled(true);
          localStorage.setItem('app-installed', 'true');
          setSnackbarMessage('تم تثبيت التطبيق بنجاح!');
          setShowSnackbar(true);
          return true;
        }
        return false;
      };

      // Check every 500ms for 10 seconds after showing instructions
      const safariCheckInterval = setInterval(() => {
        if (safariInstallCheck()) {
          clearInterval(safariCheckInterval);
        }
      }, 500);

      // Clean up after 10 seconds
      setTimeout(() => {
        clearInterval(safariCheckInterval);
      }, 10000);
      
    } else if (deferredPrompt) {
      // Show install prompt for other browsers
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setSnackbarMessage('جاري تثبيت التطبيق...');
        setShowSnackbar(true);
      } else {
        setSnackbarMessage('تم إلغاء التثبيت');
        setShowSnackbar(true);
      }
      
      setDeferredPrompt(null);
    }
  };

  // Don't show button if already installed
  if (isInstalled || !showInstallButton) {
    return null;
  }

  // Show in Sidebar for desktop, Dashboard for tablet/mobile
  const shouldShowInSidebar = showInSidebar && !isTabletOrMobile;
  const shouldShowInDashboard = !showInSidebar && isTabletOrMobile;

  // Don't show if not in the right context
  if (!shouldShowInSidebar && !shouldShowInDashboard) {
    return null;
  }

  return (
    <>
      <Box className="install-button-container">
        <Button
          variant="contained"
          startIcon={isSafari ? <ShareIcon /> : <GetAppIcon />}
          onClick={handleInstallClick}
          className={`install-button ${isSafari ? 'safari' : ''}`}
          fullWidth={shouldShowInSidebar}
        >
          {isSafari 
            ? 'أضف إلى الشاشة الرئيسية' 
            : 'تثبيت التطبيق'
          }
        </Button>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="info"
          sx={{ 
            bgcolor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            '& .MuiAlert-icon': {
              color: 'var(--primary-color)'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InstallButton;
