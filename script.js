const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

const siteConfig = window.SOCIONAVIK_CONFIG || {};
const businessConfig = siteConfig.business || {};
const socialConfig = siteConfig.social || {};
const configuredWhatsApp = siteConfig.whatsapp?.enabled ? siteConfig.whatsapp.base : '';

const configValues = {
  email: businessConfig.email,
  phone: businessConfig.phone,
  whatsapp: businessConfig.whatsapp,
  location: businessConfig.location,
  instagram: socialConfig.instagram,
  instagramText: businessConfig.instagram,
  linkedin: socialConfig.linkedin,
  facebook: socialConfig.facebook
};

document.querySelectorAll('[data-config]').forEach((element) => {
  const key = element.dataset.config;

  if (key === 'whatsappLink') {
    if (configuredWhatsApp) {
      element.href = configuredWhatsApp;
    } else {
      element.hidden = true;
    }
    return;
  }

  const value = configValues[key];
  if (value) {
    element.hidden = false;
    if (key === 'email') {
      element.href = `mailto:${value}`;
      element.textContent = value;
    } else if (key === 'phone') {
      element.href = `tel:+${value.replace(/\D/g, '')}`;
      element.textContent = value;
    } else if (key === 'whatsapp') {
      element.href = configuredWhatsApp;
      element.textContent = value;
    } else if (key === 'location' || key === 'instagramText') {
      element.textContent = value;
    } else {
      element.href = value;
    }
  } else if (['whatsapp', 'linkedin', 'facebook'].includes(key)) {
    if (key === 'whatsapp') {
      element.closest('.contact-detail')?.remove();
    } else {
      element.remove();
    }
  }
});

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });
}

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const measurementId = window.SOCIONAVIK_CONFIG?.analytics?.measurementId || '';

function sendAnalyticsEvent(name, data = {}) {
  if (!measurementId) {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  window.dataLayer.push({ event: name, ...data });
}

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitButton = contactForm?.querySelector('button[type="submit"]');
const submitLabel = submitButton?.textContent || 'Request a Growth Strategy';
let isSubmitting = false;

function getConfiguredEmail() {
  return window.SOCIONAVIK_CONFIG?.business?.email || 'socionavik@gmail.com';
}

function getConfiguredFormEndpoint() {
  return window.SOCIONAVIK_CONFIG?.contact?.formEndpoint || 'https://api.web3forms.com/submit';
}

function getWeb3FormsAccessKey() {
  return window.SOCIONAVIK_CONFIG?.contact?.web3formsAccessKey || '';
}

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (isSubmitting) {
    return;
  }

  const data = new FormData(contactForm);
  const honeypot = String(data.get('website') || '').trim();

  if (honeypot.length > 0) {
    if (formStatus) {
      formStatus.textContent = 'The submission could not be processed.';
    }
    return;
  }

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();

    if (formStatus) {
      formStatus.textContent = 'Please complete all required fields before sending.';
    }
    return;
  }

  const values = {
    name: String(data.get('name') || '').trim(),
    email: String(data.get('email') || '').trim(),
    phone: String(data.get('phone') || '').trim(),
    company: String(data.get('company') || 'Not provided').trim(),
    service: String(data.get('service') || '').trim(),
    budget: String(data.get('budget') || '').trim(),
    details: String(data.get('details') || 'No project details provided.').trim()
  };

  if (!values.name || !values.email || !values.phone || !values.service || !values.budget || !values.details) {
    if (formStatus) {
      formStatus.textContent = 'Please complete every required field.';
    }
    return;
  }

  isSubmitting = true;
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
  }

  const subject = encodeURIComponent(`New Project Inquiry from ${values.name}`);
  const body = encodeURIComponent(
    `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone}\nCompany: ${values.company}\nService Required: ${values.service}\nBudget Range: ${values.budget}\n\nProject Details:\n${values.details}`
  );

  const endpoint = getConfiguredFormEndpoint();
  const accessKey = getWeb3FormsAccessKey();
  if (endpoint && accessKey) {
    if (formStatus) {
      formStatus.textContent = 'Your project brief is being submitted.';
    }

    const submission = {
      access_key: accessKey,
      subject: `New Project Inquiry from ${values.name}`,
      from_name: values.name,
      email: values.email,
      phone: values.phone,
      company: values.company,
      service: values.service,
      budget: values.budget,
      message: values.details,
      to: getConfiguredEmail()
    };

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(submission)
    })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error('Failed to submit');
        }

        if (result.success === false) {
          throw new Error(result.message || 'Failed to submit');
        }

        sendAnalyticsEvent('contact_form_submit', { service: values.service, budget: values.budget });
        if (formStatus) {
          formStatus.textContent = 'Thank you. SOCIONAVIK will contact you shortly.';
        }
        contactForm.reset();
        isSubmitting = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitLabel;
        }
      })
      .catch(() => {
        if (formStatus) {
          formStatus.textContent = `We could not send your brief. Please email it directly to ${getConfiguredEmail()}.`;
        }
        isSubmitting = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitLabel;
        }
        const fallbackMailto = `mailto:${getConfiguredEmail()}?subject=${subject}&body=${body}`;
        window.location.href = fallbackMailto;
      });
    return;
  }

  sendAnalyticsEvent('contact_form_start', { service: values.service, budget: values.budget });

  if (formStatus) {
    formStatus.textContent = 'Online form delivery is not configured yet. Please email your project brief to socionavik@gmail.com.';
  }

  isSubmitting = false;
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = submitLabel;
  }

  const fallbackMailto = `mailto:${getConfiguredEmail()}?subject=${subject}&body=${body}`;
  window.location.href = fallbackMailto;
});

const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
whatsappLinks.forEach((link) => {
  link.addEventListener('click', () => {
    sendAnalyticsEvent('whatsapp_click', { link: link.href });
  });
});

document.querySelectorAll('a[href^="#contact"]').forEach((link) => {
  link.addEventListener('click', () => {
    sendAnalyticsEvent('cta_click_contact', { label: link.textContent.trim() || 'contact_cta' });
  });
});

const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(194,166,120,0.12), transparent), var(--paper-soft)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});
