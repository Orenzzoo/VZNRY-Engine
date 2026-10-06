import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper, { BRIEF_STEPS } from '../components/Stepper.jsx';
import LaneBuilder from '../components/LaneBuilder.jsx';
import { EXAMPLES, BriefSource, useExample, useEpisodes } from './briefExamples.jsx';
import { submitForReview } from '../data/work.js';
import { useCurrentUser } from '../data/team.jsx';

// Step 4 of a custom video: generate hooks, cores and CTAs for the chosen episodes, approve, and stitch.
export default function CustomGenerate() {
  const [exId] = useExample();
  const user = useCurrentUser();
  const ex = EXAMPLES[exId];
  const { selected, all } = useEpisodes(exId);
  const eps = selected.length ? selected : all;
  const pools = {
    hooks: eps.map((c) => c.hook),
    cores: ex.beats.slice(1).map(([, text]) => text.replace(/^"|"$/g, '')),
    // The promo is locked; the ending around it can vary.
    ctas: [ex.promo.split('.')[0].replace(/^"/, '').trim() || 'Promo', 'Promo, then "Follow for the next episode"', 'Promo, then "Comment what you want next"']
  };

  return (
    <Layout section="Custom videos" crumbs={['Custom videos', ex.name, 'Generate']} screen="Custom video generate" brand={{ name: ex.client, color: ex.dot }}>
      <Stepper steps={BRIEF_STEPS.map((s) => ({ ...s, to: `${s.to}?ex=${exId}` }))} current={3} />
      <PageHead
        title={`Generate ${selected.length ? selected.length + ' ' : ''}${ex.conceptsTitle.toLowerCase()}.`}
        lede="Hooks come from your episodes, the middle from the story beats, and the ending is the locked promo. Approve what you like, then stitch."
        right={<BriefSource exId={exId} />}
      />
      <LaneBuilder key={exId} pools={pools} formatName={ex.format || 'Custom video'} title="Generate, then approve" reviewerName="David"
        onSend={(ads) => submitForReview({ editor: user.id, reviewer: 'david', ads, title: ex.name, client: ex.client === 'New custom video' ? '' : ex.client, dot: ex.dot })} doneTo="/" />
    </Layout>
  );
}
