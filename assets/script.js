        // DOM Elements
        const toInput = document.getElementById('to');
        const subjectInput = document.getElementById('subject');
        const bodyInput = document.getElementById('body');
        const ccInput = document.getElementById('cc');
        const bccInput = document.getElementById('bcc');
        const generateBtn = document.getElementById('generateBtn');
        const clearBtn = document.getElementById('clearBtn');
        const linkResult = document.getElementById('linkResult');
        const mailtoLink = document.getElementById('mailtoLink');
        const copyLinkBtn = document.getElementById('copyLinkBtn');
        const qrPlaceholder = document.getElementById('qrPlaceholder');
        const qrCode = document.getElementById('qrCode');
        const downloadQrBtn = document.getElementById('downloadQrBtn');
        const notification = document.getElementById('notification');
        const qrWarning = document.getElementById('qrWarning');
        const previewLink = document.getElementById('previewLink');
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        const templateBtns = document.querySelectorAll('.template-btn');

        // Email templates
        const templates = {
            meeting: {
                subject: "Meeting Request: [Topic]",
                body: "Hello,\n\nI hope this email finds you well. I would like to schedule a meeting to discuss [topic]. Would any of the following times work for you?\n\n- [Option 1]\n- [Option 2]\n- [Option 3]\n\nLooking forward to your response.\n\nBest regards,\n[Your Name]"
            },
            feedback: {
                subject: "Feedback Request: [Project/Product]",
                body: "Hello,\n\nI hope you're doing well. I'm reaching out to request your feedback on [project/product]. Your insights would be incredibly valuable as we work to improve.\n\nPlease let me know your thoughts on the following:\n\n1. [Question 1]\n2. [Question 2]\n3. [Question 3]\n\nThank you for your time and assistance.\n\nWarmly,\n[Your Name]"
            },
            introduction: {
                subject: "Introduction: [Your Name]",
                body: "Hello [Recipient Name],\n\nMy name is [Your Name], and I [brief introduction about yourself or how you found them].\n\nI'm reaching out because [reason for contact].\n\n[Additional context or specific request]\n\nI look forward to potentially connecting.\n\nBest regards,\n[Your Name]\n[Your contact information]"
            },
            followup: {
                subject: "Follow-up: [Previous Interaction]",
                body: "Hello [Recipient Name],\n\nI hope you're doing well. I'm following up on our previous [conversation/meeting/interaction] about [topic].\n\n[Reference specific details from previous interaction]\n\n[Ask question or state next steps]\n\nThank you for your time.\n\nBest regards,\n[Your Name]"
            }
        };

        // Tab functionality
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const tabId = tab.dataset.tab + 'Tab';
                document.getElementById(tabId).classList.add('active');
            });
        });

        // Template functionality
        templateBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const templateName = btn.dataset.template;
                const template = templates[templateName];
                
                if (template) {
                    subjectInput.value = template.subject;
                    bodyInput.value = template.body;
                    
                    // Animate fields that were filled
                    subjectInput.classList.add('shake');
                    bodyInput.classList.add('shake');
                    
                    // Remove animation class after animation completes
                    setTimeout(() => {
                        subjectInput.classList.remove('shake');
                        bodyInput.classList.remove('shake');
                    }, 500);
                    
                    // Switch to basic tab to show the filled fields
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    document.querySelector('[data-tab="basic"]').classList.add('active');
                    document.getElementById('basicTab').classList.add('active');
                }
            });
        });

        // Generate email link
        function generateMailtoLink() {
            const to = toInput.value.trim();
            const subject = encodeURIComponent(subjectInput.value.trim());
            const body = encodeURIComponent(bodyInput.value.trim());
            const cc = encodeURIComponent(ccInput ? ccInput.value.trim() : '');
            const bcc = encodeURIComponent(bccInput ? bccInput.value.trim() : '');
            
            if (!to) {
                showNotification('Please enter at least one recipient email', 'error');
                toInput.focus();
                return false;
            }
            
            let link = `mailto:${to}?`;
            
            if (subject) link += `subject=${subject}&`;
            if (body) link += `body=${body}&`;
            if (cc) link += `cc=${cc}&`;
            if (bcc) link += `bcc=${bcc}&`;
            
            // Remove trailing & or ? if exists
            link = link.replace(/[&?]$/, '');
            
            return link;
        }

        // Display the mailto link
        function displayLink(link) {
            mailtoLink.textContent = link;
            linkResult.classList.add('show');
            previewLink.style.display = 'inline-flex';
            previewLink.href = link;
            
            // Generate QR code
            generateQRCode(link);
        }

        // Generate QR code
        function generateQRCode(link) {
            qrPlaceholder.style.display = 'none';
            qrCode.style.display = 'block';
            qrCode.innerHTML = '';
            
            new QRCode(qrCode, {
                text: link,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            
            // Show download button
            downloadQrBtn.style.display = 'flex';
            
            // Always show the QR code warning as requested
            qrWarning.classList.add('show');
        }

        // Clear all form fields
        function clearFields() {
            toInput.value = '';
            subjectInput.value = '';
            bodyInput.value = '';
            if (ccInput) ccInput.value = '';
            if (bccInput) bccInput.value = '';
            
            // Hide results
            linkResult.classList.remove('show');
            qrCode.style.display = 'none';
            qrPlaceholder.style.display = 'flex';
            downloadQrBtn.style.display = 'none';
            previewLink.style.display = 'none';
            
            // Focus on the first field
            toInput.focus();
        }

        // Show notification
        function showNotification(message, type = 'success') {
            const notificationText = document.getElementById('notificationText');
            notification.className = 'notification';
            notification.classList.add(type);
            notificationText.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Copy to clipboard
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(
                () => {
                    showNotification('Copied to clipboard!');
                },
                () => {
                    showNotification('Failed to copy to clipboard!', 'error');
                }
            );
        }

        // Download QR code
        function downloadQR() {
            const canvas = qrCode.querySelector('canvas');
            if (!canvas) return;
            
            const link = document.createElement('a');
            link.download = 'mailtolink-org-qr.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            showNotification('QR code downloaded!');
        }

        // Event listeners
        generateBtn.addEventListener('click', () => {
            const link = generateMailtoLink();
            if (link) {
                displayLink(link);
                generateBtn.innerHTML = '<span class="icon">✓</span> Link Generated';
                setTimeout(() => {
                    generateBtn.innerHTML = '<span>Generate Link</span>';
                }, 2000);
            }
        });

        clearBtn.addEventListener('click', clearFields);

        copyLinkBtn.addEventListener('click', () => {
            copyToClipboard(mailtoLink.textContent);
        });

        downloadQrBtn.addEventListener('click', downloadQR);

        // Add some cool interactions
        const inputs = [toInput, subjectInput, bodyInput];
        if (ccInput) inputs.push(ccInput);
        if (bccInput) inputs.push(bccInput);

        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });

        // Handle Enter key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                generateBtn.click();
            }
        });

        // Show helpful hint about keyboard shortcut
        const helpText = document.createElement('div');
        helpText.className = 'help-text';
        helpText.textContent = 'Pro tip: Press Ctrl+Enter to quickly generate a link';
        generateBtn.parentElement.appendChild(helpText);

        // Support function to validate email format
        function isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        // Add input validation
        toInput.addEventListener('blur', () => {
            const emails = toInput.value.split(',').map(email => email.trim());
            let allValid = true;
            
            for (const email of emails) {
                if (email && !isValidEmail(email)) {
                    allValid = false;
                    break;
                }
            }
            
            if (!allValid && toInput.value) {
                toInput.style.borderColor = 'var(--error)';
                showNotification('Please enter valid email addresses', 'error');
            } else {
                toInput.style.borderColor = '';
            }
        });

        if (ccInput) {
            ccInput.addEventListener('blur', () => {
                const emails = ccInput.value.split(',').map(email => email.trim());
                let allValid = true;
                
                for (const email of emails) {
                    if (email && !isValidEmail(email)) {
                        allValid = false;
                        break;
                    }
                }
                
                if (!allValid && ccInput.value) {
                    ccInput.style.borderColor = 'var(--error)';
                    showNotification('Please enter valid CC email addresses', 'error');
                } else {
                    ccInput.style.borderColor = '';
                }
            });
        }

        if (bccInput) {
            bccInput.addEventListener('blur', () => {
                const emails = bccInput.value.split(',').map(email => email.trim());
                let allValid = true;
                
                for (const email of emails) {
                    if (email && !isValidEmail(email)) {
                        allValid = false;
                        break;
                    }
                }
                
                if (!allValid && bccInput.value) {
                    bccInput.style.borderColor = 'var(--error)';
                    showNotification('Please enter valid BCC email addresses', 'error');
                } else {
                    bccInput.style.borderColor = '';
                }
            });
        }

        // Add dark mode toggle
        const themeToggle = document.createElement('button');
        themeToggle.className = 'button button-secondary';
        themeToggle.style.position = 'fixed';
        themeToggle.style.top = '1rem';
        themeToggle.style.right = '1rem';
        themeToggle.style.zIndex = '100';
        themeToggle.innerHTML = '<span class="icon">🌙</span>';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        document.body.appendChild(themeToggle);

        // Check for system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (prefersDarkMode) {
            document.documentElement.classList.add('dark-mode');
            themeToggle.innerHTML = '<span class="icon">☀️</span>';
        }

        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
            
            if (document.documentElement.classList.contains('dark-mode')) {
                themeToggle.innerHTML = '<span class="icon">☀️</span>';
            } else {
                themeToggle.innerHTML = '<span class="icon">🌙</span>';
            }
        });

        // Add dark mode styles
        const darkModeStyles = document.createElement('style');
        darkModeStyles.textContent = `
            .dark-mode {
                --primary: #818cf8;
                --primary-dark: #6366f1;
                --secondary: #c084fc;
                --gradient-start: #818cf8;
                --gradient-end: #c084fc;
                --bg-color: #0f172a;
                --card-bg: #1e293b;
                --text-primary: #f1f5f9;
                --text-secondary: #94a3b8;
                --border-color: #334155;
                --success: #34d399;
                --error: #f87171;
            }

            .dark-mode .button-secondary {
                background-color: #1e293b;
                border-color: #334155;
                color: #f1f5f9;
            }

            .dark-mode .button-secondary:hover {
                background-color: #334155;
            }

            .dark-mode .result-box {
                background-color: #0f172a;
                border-color: #334155;
            }

            .dark-mode .copy-btn {
                background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
                color: white;
                border: none;
            }

            .dark-mode .tabs {
                border-color: #334155;
            }

            .dark-mode .tab.active {
                color: #818cf8;
                border-color: #818cf8;
            }

            .dark-mode #qrPlaceholder {
                background-color: #0f172a;
            }

            .dark-mode #previewLink {
                background-color: #0f172a;
                border-color: #334155;
            }

            .dark-mode footer {
                background-color: #0f172a;
            }
        `;
        document.head.appendChild(darkModeStyles);

        // Add SEO structured data
        const structuredData = document.createElement('script');
        structuredData.type = 'application/ld+json';
        structuredData.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Email Link Generator",
            "description": "Create beautiful custom email links and QR codes in seconds",
            "applicationCategory": "Productivity",
            "operatingSystem": "All",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "featureList": [
                "Create custom mailto links",
                "Generate QR codes from email links",
                "Easily add CC and BCC recipients",
                "Use email templates"
            ]
        });
        document.head.appendChild(structuredData);

        // Add robots meta tag for SEO
        const robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        robotsMeta.content = 'index, follow';
        document.head.appendChild(robotsMeta);

        // Add animation to header on page load
        window.addEventListener('load', () => {
            const header = document.querySelector('header');
            header.style.opacity = '0';
            header.style.transform = 'translateY(-20px)';
            header.style.transition = 'opacity 1s ease, transform 1s ease';
            
            setTimeout(() => {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 100);
        });

        // Initialize UI
        clearFields();