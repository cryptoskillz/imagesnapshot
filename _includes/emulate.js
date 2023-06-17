  let whenDocumentReady = (f) => {
      /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
  }

  whenDocumentReady(isReady = () => {
      document.getElementById('showBody').classList.remove('d-none');


  })

     
