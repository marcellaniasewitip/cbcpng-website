import { useId, useState } from 'react';
import { api } from '../api';
import { useSite } from '../SiteContext';
import PageHead from '../components/PageHead';
import Photo from '../components/Photo';
import { Fill } from '../components/Fill';
import { Phone, Email } from '../components/Contact';
import useDocumentTitle from '../components/useDocumentTitle';

const SUBJECTS = ['General enquiry', 'Find a church', 'Youth', 'Bible College', 'Education', 'Health', 'CBM / Bookshops', 'Giving and partnership', 'Prayer request'];
const EMPTY = { full_name: '', email: '', phone: '', subject: '', message: '', website: '' };

export default function Contact() {
  useDocumentTitle('Contact Us');
  const { data } = useSite();
  const s = data.settings;
  const mapPhoto = data.gallery.contact?.[0];

  return (
    <>
      <PageHead title="Contact Us" lead="We would be glad to hear from you." />
      <section className="block">
        <div className="wrap split">
          <div className="card">
            <h3>CBC PNG Head Office</h3>
            <ul className="contact-list">
              <li><b>Address</b><Fill value={s.office_address} hint="Street, town, province" /></li>
              <li><b>Postal</b><Fill value={s.office_postal} hint="PO Box, town, province" /></li>
              <li><b>Phone</b><Phone value={s.office_phone} hint="+675 …" /></li>
              <li><b>Email</b><Email value={s.office_email} hint="email address" /></li>
              <li><b>Office hours</b><Fill value={s.office_hours} hint="Mon–Fri, 8:00 am – 4:00 pm" /></li>
              {s.facebook_url && (
                <li><b>Facebook</b><a href={s.facebook_url} target="_blank" rel="noopener noreferrer">CBC PNG Facebook group</a></li>
              )}
            </ul>
          </div>
          <div>
            <h3>Ministry contacts</h3>
            <ul className="contact-list">
              {data.ministryContacts.map((m) => (
                <li key={m.id}><b>{m.ministry}</b><Fill value={m.contact} hint="Name, phone" /></li>
              ))}
            </ul>
            {s.map_embed_url
              ? <iframe className="map-frame" src={s.map_embed_url} title="Map of CBC PNG head office" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              : <Photo src={mapPhoto?.image_url} wide caption="Map of head office location (embed Google Map)" style={{ marginTop: '1.2rem' }} />}
          </div>
        </div>
      </section>
      <section className="block" id="message">
        <div className="wrap">
          <h2>Send us a message</h2>
          <p className="note">We reply by email or phone, usually within a few working days.</p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: null, text: '' });
  const [sending, setSending] = useState(false);
  const uid = useId();
  const id = (k) => `${uid}-${k}`;

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  function validate() {
    const er = {};
    if (!form.full_name.trim()) er.full_name = 'Enter your name.';
    if (!form.email.trim() && !form.phone.trim()) er.email = 'Enter an email address or a phone number so we can reply.';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) er.email = 'Enter an email address like name@example.com.';
    if (!form.subject) er.subject = 'Choose what your message is about.';
    if (form.message.trim().length < 10) er.message = 'Write a message of at least 10 characters.';
    return er;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) {
      setStatus({ type: 'err', text: 'Check the highlighted fields.' });
      document.getElementById(id(Object.keys(er)[0]))?.focus();
      return;
    }
    setSending(true);
    setStatus({ type: null, text: '' });
    try {
      await api('/contact', { method: 'POST', body: form });
      setForm(EMPTY);
      setStatus({ type: 'ok', text: 'Message sent. Thank you — we will get back to you soon.' });
    } catch (err) {
      setErrors(err.fields || {});
      setStatus({ type: 'err', text: err.message });
    } finally {
      setSending(false);
    }
  }

  const fieldProps = (k) => ({
    id: id(k), name: k, value: form[k], onChange: update(k),
    'aria-invalid': errors[k] ? 'true' : undefined,
    'aria-describedby': errors[k] ? `${id(k)}-err` : undefined,
  });
  const Err = ({ k }) => (errors[k] ? <span className="error" id={`${id(k)}-err`}>{errors[k]}</span> : null);

  return (
    <form className="card" onSubmit={onSubmit} noValidate style={{ maxWidth: 820 }}>
      {status.text && <div className={`alert ${status.type}`} role={status.type === 'err' ? 'alert' : 'status'}>{status.text}</div>}
      <div className="form-grid">
        <div className="field full">
          <label htmlFor={id('full_name')}>Your name</label>
          <input {...fieldProps('full_name')} autoComplete="name" />
          <Err k="full_name" />
        </div>
        <div className="field">
          <label htmlFor={id('email')}>Email</label>
          <input {...fieldProps('email')} type="email" autoComplete="email" inputMode="email" />
          <Err k="email" />
        </div>
        <div className="field">
          <label htmlFor={id('phone')}>Phone <span className="hint">(optional if you give an email)</span></label>
          <input {...fieldProps('phone')} type="tel" autoComplete="tel" inputMode="tel" placeholder="+675" />
        </div>
        <div className="field full">
          <label htmlFor={id('subject')}>What is your message about?</label>
          <select {...fieldProps('subject')}>
            <option value="">Choose one</option>
            {SUBJECTS.map((x) => <option key={x}>{x}</option>)}
          </select>
          <Err k="subject" />
        </div>
        <div className="field full">
          <label htmlFor={id('message')}>Message</label>
          <textarea {...fieldProps('message')} rows={6} />
          <Err k="message" />
        </div>
        <div className="hp" aria-hidden="true">
          <label htmlFor={id('website')}>Leave this empty</label>
          <input {...fieldProps('website')} tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      <button className="btn" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
