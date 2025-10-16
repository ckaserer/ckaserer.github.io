import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

// SVG component imports (emblem variants sized via CSS)
import WorkCodexSvg from '@site/static/img/work-codex-emblem.svg';
import PersonalOsSvg from '@site/static/img/personal-os-emblem.svg';
import SkyledgerEmblem from '@site/static/img/skyledger-emblem.svg';
import { JSX } from 'react';

type HomeFeature = {
  id: string;
  title: string;
  description: JSX.Element;
  link: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  alt: string;
};

const homeFeatures: HomeFeature[] = [
  {
    id: 'work-codex',
    title: 'homepage.workCodex.title',
    description: (
      <Translate id="homepage.workCodex.description">
        Guidelines and strategies for professional growth, productivity, and project management. Build your own systems for work success.
      </Translate>
    ),
    link: '/work-codex/',
    Svg: WorkCodexSvg,
    alt: 'Work Codex emblem',
  },
  {
    id: 'personal-os',
    title: 'homepage.personalOs.title',
    description: (
      <Translate id="homepage.personalOs.description">
        Your personal operating system for intentional living. Explore systems, principles, and routines for a more organized life.
      </Translate>
    ),
    link: '/personal-os/',
    Svg: PersonalOsSvg,
    alt: 'Personal OS emblem',
  },
  {
    id: 'skyledger',
    title: 'homepage.skyledger.title',
    description: (
      <Translate id="homepage.skyledger.description">
        Cloud foundation and infrastructure knowledge for enterprises in the EEA. Find best practices, ADRs, and implementation recommendations.
      </Translate>
    ),
    link: '/skyledger/',
    Svg: SkyledgerEmblem,
    alt: 'Skyledger emblem',
  },
];


function FeatureCard({ feature }: { feature: HomeFeature }) {
  const { Svg, alt } = feature;
  const pillarClass =
    feature.id === 'skyledger'
      ? styles.pillarSkyledger
      : feature.id === 'work-codex'
      ? styles.pillarWork
      : feature.id === 'personal-os'
      ? styles.pillarPersonal
      : '';
  return (
    <div className="col col--4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Link
        to={feature.link}
        className={`${styles.card} ${styles.pillarCard} ${pillarClass}`}
        style={{ alignItems: 'center', textAlign: 'center', textDecoration: 'none' }}
        aria-label={`Open ${feature.id}`}
      >
        <div className={styles.featureSvgWrapper}>
          <Svg role="img" aria-label={alt} />
        </div>
        <Heading as="h2">
          <Translate id={feature.title}>Title</Translate>
        </Heading>
        <p>{feature.description}</p>
      </Link>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <main>
        <section className={styles.section}>
          <div className="container">
            <div className="row" style={{ justifyContent: 'center', textAlign: 'center' }}>
              {homeFeatures.map((f) => (
                <FeatureCard key={f.id} feature={f} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
