import { useSite } from '../SiteContext';
import PageHead from '../components/PageHead';
import Photo from '../components/Photo';
import Person from '../components/Person';
import DataTable from '../components/DataTable';
import FindChurch from '../components/FindChurch';
import { Fill, FillBlock } from '../components/Fill';
import { Phone, Email } from '../components/Contact';
import useDocumentTitle from '../components/useDocumentTitle';
import { formatDate, isBlank, lines } from '../utils';

const LINKS = [
  { to: '/about#vision', label: 'Vision & Mission' },
  { to: '/about#church', label: 'The Church' },
  { to: '/about#youth', label: 'Youth Ministries' },
  { to: '/about#college', label: 'Bible College & Schools' },
  { to: '/about#mission', label: 'Overseas Mission' },
  { to: '/about#history', label: 'History' },
];

export default function About() {
  useDocumentTitle('About Us');
  const { data } = useSite();
  const s = data.settings;
  const youthEvents = data.events.youth || [];
  const colleges = data.institutions.bible_college || [];
  const prayer = lines(s.mission_prayer_points);

  return (
    <>
      <PageHead title="About Us" lead="Who we are, what we believe, and how God has led CBC PNG." links={LINKS} />

      {/* ---------------- Vision & Mission ---------------- */}
      <section className="block" id="vision">
        <div className="wrap">
          <h2>Vision &amp; Mission</h2>
          <div className="split">
            <div>
              <h3>Our vision</h3>
              <FillBlock value={s.vision} hint="Our vision statement." draft={s.vision_confirmed !== '1'} />
              <h3>Our mission</h3>
              <FillBlock value={s.mission} hint="Our mission statement." draft={s.mission_confirmed !== '1'} />
            </div>
            <div>
              <h3>Our values</h3>
              {s.values_confirmed !== '1' && <p className="note">Draft list. Replace with the church’s official values.</p>}
              <ul className="values">
                {data.values.map((v) => <li key={v.id}><b>{v.title}</b>{v.description}</li>)}
              </ul>
            </div>
          </div>
          <h3>Statement of faith</h3>
          <FillBlock value={s.statement_of_faith} hint="Insert the church’s official statement of faith here, word for word, as approved by the National Executive." />
        </div>
      </section>

      {/* ---------------- The Church ---------------- */}
      <section className="block" id="church">
        <div className="wrap">
          <h2>The Church</h2>
          <p>
            CBC PNG is a fellowship of local assemblies joined in a national body for shared ministry, training
            and services. Each congregation is led by <Fill value={s.church_led_by} hint="elders / pastors" />,
            and the national church is guided by the <Fill value={s.church_governed_by} hint="General Assembly / National Executive" />.
          </p>

          <h3>Our leadership</h3>
          <div className="people">
            {data.leaders.map((l) => <Person key={l.id} name={l.full_name} role={l.title} photo={l.photo_url} />)}
          </div>

          <h3>Head office</h3>
          <div className="card" style={{ maxWidth: 560 }}>
            <ul className="contact-list">
              <li><b>Address</b><Fill value={s.office_address} hint="Street, town, province" /></li>
              <li><b>Postal</b><Fill value={s.office_postal} hint="PO Box, town, province" /></li>
              <li><b>Phone</b><Phone value={s.office_phone} hint="+675 …" /></li>
              <li><b>Email</b><Email value={s.office_email} hint="email address" /></li>
              <li><b>Office hours</b><Fill value={s.office_hours} hint="Mon–Fri, 8:00 am – 4:00 pm" /></li>
            </ul>
          </div>

          <h3 className="mt" id="find-church">Find a church</h3>
          <FindChurch provinces={data.provinces} />
        </div>
      </section>

      {/* ---------------- Youth ---------------- */}
      <section className="block" id="youth">
        <div className="wrap">
          <h2>Youth Ministries</h2>
          <div className="split">
            <div>
              <p>{s.youth_intro}</p>
              <h3>What we do</h3>
              <ul className="plain">{data.youthActivities.map((a) => <li key={a.id}>{a.title}</li>)}</ul>
              <h3>National youth coordinator</h3>
              <div className="person-row">
                <Photo src={s.youth_coordinator_photo} round caption="Photo" alt={s.youth_coordinator_name} />
                <div className="lines">
                  <Fill as="b" value={s.youth_coordinator_name} hint="Full name" />
                  <Phone value={s.youth_coordinator_phone} />
                  <Email value={s.youth_coordinator_email} />
                </div>
              </div>
            </div>
            <div>
              <h3>Upcoming events</h3>
              <DataTable
                caption="Upcoming youth events"
                empty="Add upcoming youth events."
                rows={youthEvents}
                columns={[
                  { key: 'date', label: 'Date', render: (r) => <Fill value={r.event_date || r.date_text} hint="Date">{formatDate(r.event_date) || r.date_text}</Fill> },
                  { key: 'title', label: 'Event' },
                  { key: 'venue', label: 'Place', hint: 'Venue' },
                ]}
              />
              <Gallery items={data.gallery.youth} prefix="Photo: " />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Bible College ---------------- */}
      <section className="block" id="college">
        <div className="wrap">
          <h2>Bible College &amp; Schools</h2>
          <p>
            <Fill value={s.bible_college_name} hint="Name of Bible College" />, located at{' '}
            <Fill value={s.bible_college_location} hint="place, province" />, trains pastors, evangelists and
            church workers for ministry in Papua New Guinea.
          </p>
          <DataTable
            caption="Bible colleges and schools"
            empty="Add Bible colleges and schools."
            rows={colleges}
            columns={[
              { key: 'name', label: 'Institution' },
              { key: 'location', label: 'Location', hint: 'Place, province' },
              { key: 'courses', label: 'Courses offered', hint: 'Courses' },
              { key: 'length', label: 'Length' },
              { key: 'intake', label: 'Intake', hint: 'Month' },
              { key: 'fees', label: 'Fees (PGK)', hint: 'K …', render: (r) => <Fill value={r.fees} hint="K …">{/^k/i.test(r.fees || '') ? r.fees : `K ${r.fees}`}</Fill> },
            ]}
          />
          <h3>How to apply</h3>
          <FillBlock value={s.how_to_apply} hint="Entry requirements, where to get an application form, closing dates and who to contact." />
        </div>
      </section>

      {/* ---------------- Overseas Mission ---------------- */}
      <section className="block" id="mission">
        <div className="wrap">
          <h2>Overseas Mission</h2>
          <p>{s.mission_intro}</p>
          <div className="split">
            <div>
              <h3>Our partners</h3>
              <ul className="plain">
                {data.partners.map((p) => (
                  <li key={p.id}>
                    {p.website ? <a href={p.website} target="_blank" rel="noopener noreferrer">{p.name}</a> : p.name}
                    {p.country && `, ${p.country}`}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Our missionaries</h3>
              {data.missionaries.length ? (
                <div className="people compact">
                  {data.missionaries.map((m) => (
                    <Person key={m.id} name={m.full_name} photo={m.photo_url} role={[m.country, m.ministry].filter(Boolean).join(', ')} roleHint="Country, ministry" />
                  ))}
                </div>
              ) : <div className="fill-block"><p>Missionaries will be listed here once they have given permission to be shown publicly.</p></div>}
            </div>
          </div>
          <h3>Pray with us</h3>
          {prayer.length
            ? <ul className="plain">{prayer.map((p, i) => <li key={i}>{p}</li>)}</ul>
            : <FillBlock value={null} hint="Current prayer points for mission work." />}
        </div>
      </section>

      {/* ---------------- History ---------------- */}
      <section className="block" id="history">
        <div className="wrap">
          <h2>History</h2>
          <p>{s.history_intro}</p>
          <ol className="timeline">
            {data.history.map((h) => (
              <li key={h.id}>
                <span className="yr-wrap"><Fill value={h.year_label} hint="Year" className="yr" /></span>
                {h.description}
              </li>
            ))}
          </ol>
          <h3>Pioneers</h3>
          <FillBlock value={s.pioneers} hint="Names and short stories of the pioneers, both missionaries from overseas and Papua New Guinean leaders." />
          <h3>From our archives</h3>
          <Gallery items={data.gallery.history} prefix="Old photo: " />
        </div>
      </section>
    </>
  );
}

export function Gallery({ items = [], prefix = '' }) {
  if (!items.length) return null;
  return (
    <div className="gallery">
      {items.map((g) => (
        <figure key={g.id}>
          <Photo src={g.image_url} alt={g.caption} caption={`${prefix}${g.caption}`} />
          {!isBlank(g.image_url) && <figcaption>{g.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
