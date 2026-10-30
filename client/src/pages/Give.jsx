import { useSite } from '../SiteContext';
import PageHead from '../components/PageHead';
import { Fill, FillBlock } from '../components/Fill';
import useDocumentTitle from '../components/useDocumentTitle';

export default function Give() {
  useDocumentTitle('Give & Partner With Us');
  const { data } = useSite();
  const s = data.settings;

  return (
    <>
      <PageHead title="Give & Partner With Us" lead="Your gifts support churches, schools, health care and mission across PNG." />
      <section className="block">
        <div className="wrap split">
          <div>
            <h3>Give within Papua New Guinea</h3>
            <div className="card">
              <ul className="contact-list">
                <li><b>Bank</b><Fill value={s.bank_name} hint="BSP / Kina Bank / other" /></li>
                <li><b>Account name</b><Fill value={s.bank_account_name} hint="Account name" /></li>
                <li><b>Account no.</b><Fill value={s.bank_account_number} hint="Account number" /></li>
                <li><b>Branch</b><Fill value={s.bank_branch} hint="Branch" /></li>
                <li><b>Reference</b><Fill value={s.bank_reference} hint="e.g. ministry name" /></li>
              </ul>
            </div>
            <h3 className="mt">Give from overseas</h3>
            <FillBlock value={s.overseas_giving} hint="SWIFT code and overseas transfer details, or partner agencies that receive gifts on our behalf." />
            <p className="note">
              {s.bank_details_approved !== '1' && 'Bank details must be approved by CBC PNG church finance before publishing. '}
              All gifts are received and accounted for by <Fill value={s.finance_office} hint="office responsible" />.
            </p>
          </div>
          <div>
            <h3>Other ways to partner</h3>
            <ul className="plain">{data.partnershipWays.map((w) => <li key={w.id}>{w.text}</li>)}</ul>
            <p>To discuss partnership, contact <Fill value={s.partnership_contact} hint="name, email" />.</p>
          </div>
        </div>
      </section>
    </>
  );
}
