import urllib.request
import re

html_url = 'http://127.0.0.1:8000/index.html'
css_url = 'http://127.0.0.1:8000/styles.css'
js_url = 'http://127.0.0.1:8000/script.js'
config_url = 'http://127.0.0.1:8000/config.js'
privacy_url = 'http://127.0.0.1:8000/privacy.html'
terms_url = 'http://127.0.0.1:8000/terms.html'
error_url = 'http://127.0.0.1:8000/404.html'

html = urllib.request.urlopen(html_url).read().decode('utf-8')
css = urllib.request.urlopen(css_url).read().decode('utf-8')
js = urllib.request.urlopen(js_url).read().decode('utf-8')
config = urllib.request.urlopen(config_url).read().decode('utf-8')
privacy = urllib.request.urlopen(privacy_url).read().decode('utf-8')
terms = urllib.request.urlopen(terms_url).read().decode('utf-8')
error = urllib.request.urlopen(error_url).read().decode('utf-8')

checks = [
    'We Build Brands That Move.',
    'Web Designing',
    'SEO Optimization',
    'Email Marketing',
    'Brand Strategy',
    'Graphic Design',
    'Content Creation',
    'Social Media Ads',
    'Digital Growth',
    'Our Process',
    'Testimonials',
    'Growth Brief',
    'Request a Growth Strategy',
    '₹5,000 – ₹10,000',
    '₹10,000 – ₹25,000',
    '₹25,000 – ₹50,000',
    '₹50,000 – ₹1,00,000',
    '₹1,00,000+'
]

missing = [x for x in checks if x not in html]
service_count = len(re.findall(r'<article class="service-card reveal">', html))
portfolio_count = len(re.findall(r'<article class="portfolio-card project-card reveal">', html))
process_present = '<section class="section process" id="process">' in html
contact_form_present = '<form class="contact-form" id="contactForm" novalidate>' in html
privacy_present = '<h1>Privacy Policy</h1>' in privacy and '<strong>Note:' in privacy
terms_present = '<h1>Terms & Conditions</h1>' in terms and '<strong>Note:' in terms
error_page_present = '<h1>404</h1>' in error

print('missing=' + (','.join(missing) if missing else 'none'))
print('service_count=', service_count)
print('portfolio_count=', portfolio_count)
print('process_present=', process_present)
print('contact_form_present=', contact_form_present)
print('privacy_present=', privacy_present)
print('terms_present=', terms_present)
print('error_page_present=', error_page_present)
print('styles_bytes=', len(css.encode('utf-8')))
print('js_bytes=', len(js.encode('utf-8')))
print('assets_status=', 'section' in css and 'service-card' in css, 'IntersectionObserver' in js, 'contactForm?.addEventListener' in js)
print('web3forms_status=', 'https://api.web3forms.com/submit' in config, 'web3formsAccessKey' in config, 'message: values.details' in js, 'budget: values.budget' in js)

if missing:
    raise SystemExit(1)
if service_count != 8:
    raise SystemExit(1)
if portfolio_count != 6:
    raise SystemExit(1)
if not process_present or not contact_form_present:
    raise SystemExit(1)
if not privacy_present or not terms_present or not error_page_present:
    raise SystemExit(1)
if 'section' not in css or 'service-card' not in css or 'IntersectionObserver' not in js or 'contactForm?.addEventListener' not in js:
    raise SystemExit(1)
if 'https://api.web3forms.com/submit' not in config or 'web3formsAccessKey' not in config or 'message: values.details' not in js or 'budget: values.budget' not in js:
    raise SystemExit(1)
