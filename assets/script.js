    // Create animated particles
    function createParticles() {
      const particles = document.querySelector('.particles');
      const colors = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'];
      
      for (let i = 0; i < 20; i++) {
        const size = Math.random() * 10 + 5;
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particles.appendChild(particle);
      }
    }
    
    // Generate mailto link
    function generateMailtoLink() {
      const to = document.getElementById('emailTo').value.trim();
      const subject = encodeURIComponent(document.getElementById('subject').value.trim());
      const body = encodeURIComponent(document.getElementById('body').value.trim());
      const cc = encodeURIComponent(document.getElementById('cc').value.trim());
      const bcc = encodeURIComponent(document.getElementById('bcc').value.trim());
      
      let mailtoLink = `mailto:${to}`;
      let params = [];
      
      if (subject) params.push(`subject=${subject}`);
      if (body) params.push(`body=${body}`);
      if (cc) params.push(`cc=${cc}`);
      if (bcc) params.push(`bcc=${bcc}`);
      
      if (params.length > 0) {
        mailtoLink += '?' + params.join('&');
      }
      
      return mailtoLink;
    }
    
    // Copy text to clipboard
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        const feedback = document.getElementById('copyFeedback');
        feedback.classList.add('show');
        setTimeout(() => {
          feedback.classList.remove('show');
        }, 3000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
    
    // Generate QR code
    function generateQRCode(text) {
      document.getElementById('qrcode').innerHTML = '';
      document.getElementById('qrLoading').style.display = 'inline-block';
      
      setTimeout(() => {
        new QRCode(document.getElementById('qrcode'), {
          text: text,
          width: 200,
          height: 200,
          colorDark: '#2b2d42',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
        
        document.getElementById('qrContainer').style.display = 'flex';
        document.getElementById('qrLoading').style.display = 'none';
      }, 500);
    }
    
    // Download QR code as image
    function downloadQRCode() {
      // Get the QR code canvas
      const canvas = document.querySelector('#qrcode canvas');
      
      if (canvas) {
        // Create a temporary link element
        const link = document.createElement('a');
        
        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/png');
        
        // Set the href and download attributes
        link.href = dataURL;
        link.download = 'mailto-nimd-me.png';
        
        // Append to the body, click programmatically, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show feedback
        const feedback = document.getElementById('copyFeedback');
        feedback.textContent = 'QR code downloaded!';
        feedback.classList.add('show');
        setTimeout(() => {
          feedback.classList.remove('show');
          feedback.textContent = 'Link copied to clipboard!';
        }, 3000);
      }
    }
    
    // Form submission
    document.getElementById('mailtoForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      document.getElementById('generateLoading').style.display = 'inline-block';
      
      setTimeout(() => {
        const mailtoLink = generateMailtoLink();
        document.getElementById('resultLink').textContent = mailtoLink;
        document.getElementById('resultContainer').style.display = 'block';
        document.getElementById('qrBtn').style.display = 'block';
        document.getElementById('generateLoading').style.display = 'none';
        
        // Smooth scroll to results
        document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
      }, 600);
    });
    
    // Reset form
    document.getElementById('resetBtn').addEventListener('click', function() {
      document.getElementById('mailtoForm').reset();
      document.getElementById('resultContainer').style.display = 'none';
      document.getElementById('qrContainer').style.display = 'none';
      document.getElementById('qrBtn').style.display = 'none';
    });
    
    // Copy link
    document.getElementById('copyBtn').addEventListener('click', function() {
      const mailtoLink = document.getElementById('resultLink').textContent;
      copyToClipboard(mailtoLink);
    });
    
    // Test link
    document.getElementById('testBtn').addEventListener('click', function() {
      const mailtoLink = document.getElementById('resultLink').textContent;
      window.location.href = mailtoLink;
    });
    
    // Generate QR Code
    document.getElementById('qrBtn').addEventListener('click', function() {
      const mailtoLink = document.getElementById('resultLink').textContent;
      generateQRCode(mailtoLink);
    });
    
    // Download QR Code
    document.getElementById('downloadQrBtn').addEventListener('click', downloadQRCode);
    
    // Initialize particles on load
    window.addEventListener('load', createParticles);
