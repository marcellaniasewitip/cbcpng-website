import { useSite } from '../SiteContext';
import PageHead from '../components/PageHead';
import DataTable from '../components/DataTable';
import { Fill, FillBlock } from '../components/Fill';
import { Phone } from '../components/Contact';
import { Gallery } from './About';
import useDocumentTitle from '../components/useDocumentTitle';

const LINKS = [
  { to: '/publication#cbm', label: 'CBM' },
  { to: '/publication#bookshops', label: 'Bookshops Nationwide' },
];

export default function Publication() {
  useDocumentTitle('Publication');
  const { data } = useSite();
  const s = data.settings;

  return (
    <>
      <PageHead title="Publication" lead="God’s Word and Christian resources for every home, school and church." links={LINKS} />

      <section className="block" id="cbm">
        <div className="wrap">
          <h2>CBM</h2>
          <p>
            <Fill value={s.cbm_full_name} hint="CBM full name" /> is the publishing ministry of CBC PNG, producing
            Bibles, Christian books and teaching materials in English, Tok Pisin and{' '}
            <Fill value={s.cbm_languages} hint="local languages" />.
          </p>
          <div className="split">
            <div>
              <h3>What we publish</h3>
              <ul className="plain">{data.publications.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
            </div>
            <div>
              <h3>How to order</h3>
              <FillBlock value={s.how_to_order} hint="How churches, schools and families can order, payment options, delivery to provinces, and the CBM contact phone and email." />
            </div>
          </div>
          <Gallery items={data.gallery.cbm} prefix="Photo: " />
        </div>
      </section>

      <section className="block" id="bookshops">
        <div className="wrap">
          <h2>Bookshops Nationwide</h2>
          <p>{s.bookshops_intro}</p>
          <DataTable
            caption="CBC bookshops"
            empty="Add CBC bookshops."
            rows={data.bookshops}
            columns={[
              { key: 'name', label: 'Bookshop' },
              { key: 'town', label: 'Town / province', hint: 'Town, province' },
              { key: 'address', label: 'Address' },
              { key: 'phone', label: 'Phone', render: (r) => <Phone value={r.phone} hint="+675 …" /> },
              { key: 'hours', label: 'Opening hours', hint: 'Mon–Fri …, Sat …' },
            ]}
          />
        </div>
      </section>
    </>
  );
}
