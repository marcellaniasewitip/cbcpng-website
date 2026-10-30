import { useSite } from '../SiteContext';
import PageHead from '../components/PageHead';
import DataTable from '../components/DataTable';
import Stats from '../components/Stats';
import { Fill } from '../components/Fill';
import { Phone, Email } from '../components/Contact';
import useDocumentTitle from '../components/useDocumentTitle';
import { formatNumber } from '../utils';

const LINKS = [
  { to: '/services#training', label: 'Training' },
  { to: '/services#education', label: 'Education' },
  { to: '/services#health', label: 'Health' },
];

const num = (key) => (r) => <Fill value={r[key]} hint="0">{formatNumber(r[key])}</Fill>;

export default function Services() {
  useDocumentTitle('Training & Services');
  const { data } = useSite();
  const s = data.settings;

  return (
    <>
      <PageHead title="Training & Services" lead="Serving the nation through training, education and health care." links={LINKS} />

      <section className="block" id="training">
        <div className="wrap">
          <h2>Training</h2>
          <p>{s.training_intro}</p>
          <DataTable
            caption="Training institutes"
            empty="Add training institutes."
            rows={data.institutions.training || []}
            columns={[
              { key: 'name', label: 'Institute' },
              { key: 'location', label: 'Province' },
              { key: 'courses', label: 'Courses offered', hint: 'Courses' },
              { key: 'length', label: 'Length' },
              { key: 'intake', label: 'Intake', hint: 'Month' },
              { key: 'contact', label: 'Contact', hint: 'Phone / email' },
            ]}
          />
        </div>
      </section>

      <section className="block" id="education">
        <div className="wrap">
          <h2>Education</h2>
          <p>{s.education_intro}</p>
          <Stats items={data.stats.education || []} />
          <h3>Schools by level</h3>
          <DataTable
            caption="CBC schools by level"
            empty="Add school levels."
            rows={data.schoolLevels}
            columns={[
              { key: 'level', label: 'Level' },
              { key: 'number_of_schools', label: 'Number of schools', render: num('number_of_schools') },
              { key: 'students', label: 'Students', render: num('students') },
              { key: 'provinces', label: 'Provinces' },
            ]}
          />
          <h3>Church Education Secretaries (CES)</h3>
          <DataTable
            caption="Church Education Secretaries"
            empty="Add Church Education Secretaries."
            rows={data.secretaries}
            columns={[
              { key: 'province', label: 'Province' },
              { key: 'full_name', label: 'CES name', hint: 'Name' },
              { key: 'office', label: 'Office location', hint: 'Town' },
              { key: 'phone', label: 'Phone', render: (r) => <Phone value={r.phone} hint="+675 …" /> },
              { key: 'email', label: 'Email', render: (r) => <Email value={r.email} /> },
            ]}
          />
        </div>
      </section>

      <section className="block" id="health">
        <div className="wrap">
          <h2>Health</h2>
          <p>{s.health_intro}</p>
          <Stats items={data.stats.health || []} />
          <div className="split">
            <div>
              <h3>Facilities by type</h3>
              <DataTable
                caption="Health facilities by type"
                empty="Add health facility types."
                rows={data.facilityTypes}
                columns={[
                  { key: 'facility_type', label: 'Type' },
                  { key: 'number', label: 'Number', render: num('number') },
                  { key: 'provinces', label: 'Provinces' },
                ]}
              />
            </div>
            <div>
              <h3>Programmes</h3>
              <ul className="plain">{data.programmes.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
              <h3>Health Secretary</h3>
              <p>
                <Fill value={s.health_secretary_name} hint="Full name" /><br />
                <Phone value={s.health_secretary_phone} /> <Email value={s.health_secretary_email} />
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
