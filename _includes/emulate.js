  let whenDocumentReady = (f) => {
      /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
  }

  let changeEmulator = (deviceId) => {
      switch (deviceId) {
          case 1:
              document.getElementById('iphone-12').classList.remove('d-none');
              document.getElementById('google-pixel-7').classList.add('d-none')
              break;
          case 2:
              document.getElementById('iphone-12').classList.add('d-none');
              document.getElementById('google-pixel-7').classList.remove('d-none')

              break;
          default:
              // code block
      }
  }


  whenDocumentReady(isReady = () => {
      document.getElementById('showBody').classList.remove('d-none');
      document.getElementById('device-dropdown').classList.remove('d-none')

      // Set the user agent string to mimic an iPhone 12
      navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
      document.getElementById('browserFrame').src = getUrlParamater("url");
      document.getElementById('browserFrame2').src = getUrlParamater("url");

  })