import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Translate, { translate } from '@docusaurus/Translate';
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";


import Heading from "@theme/Heading";
import styles from "./index.module.css";

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <p className="hero__subtitle">
          <Translate id="homepage.subtitle">Curated systems for intentional living, working, and cloud strategy.</Translate>
        </p>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <section className={styles.section}>
          <div className="container">
            <div className="row" style={{ justifyContent: 'center', textAlign: 'center' }}>
              <div className="col col--4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className={styles.card} style={{ marginTop: '3rem', alignItems: 'center', textAlign: 'center' }}>
                  <img src={require("/static/img/work-codex.png").default} alt="Work Codex" style={{ width: '100%', maxWidth: '120px', marginBottom: '1rem' }} />
                  <Heading as="h2"><Translate id="homepage.workCodex.title">Work Codex</Translate></Heading>
                  <p><Translate id="homepage.workCodex.description">Guidelines and strategies for professional growth, productivity, and project management. Build your own systems for work success.</Translate></p>
                  <Link className="button button--primary" to="/docs-professional/"><Translate id="homepage.workCodex.button">Explore Work Codex</Translate></Link>
                </div>
              </div>
              <div className="col col--4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className={styles.card} style={{ marginTop: '3rem', alignItems: 'center', textAlign: 'center' }}>
                  <img src={require("/static/img/personal-os.png").default} alt="Personal OS" style={{ width: '100%', maxWidth: '120px', marginBottom: '1rem' }} />
                  <Heading as="h2"><Translate id="homepage.personalOs.title">Personal OS</Translate></Heading>
                  <p><Translate id="homepage.personalOs.description">Your personal operating system for intentional living. Explore systems, principles, and routines for a more organized life.</Translate></p>
                  <Link className="button button--primary" to="/docs-personal/"><Translate id="homepage.personalOs.button">Explore Personal OS</Translate></Link>
                </div>
              </div>
              <div className="col col--4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className={styles.card} style={{ marginTop: '3rem', alignItems: 'center', textAlign: 'center' }}>
                  <img src={require("/static/img/skyledger.png").default} alt="Skyledger" style={{ width: '100%', maxWidth: '120px', marginBottom: '1rem' }} />
                  <Heading as="h2"><Translate id="homepage.skyledger.title">Skyledger</Translate></Heading>
                  <p><Translate id="homepage.skyledger.description">Cloud foundation and infrastructure knowledge for enterprises in the EEA. Find best practices, ADRs, and implementation recommendations.</Translate></p>
                  <Link className="button button--primary" to="/docs-skyledger/"><Translate id="homepage.skyledger.button">Explore Skyledger</Translate></Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
