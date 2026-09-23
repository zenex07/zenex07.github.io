import { profile, services } from '../content/content.js';
import { useReveal } from '../hooks/useMotion.js';
import SplitHeading from './SplitHeading.jsx';
import Magnetic from './Magnetic.jsx';

export default function Contact() {
  const scope = useReveal();
  const linkedinPending = profile.linkedin.startsWith('TODO');

  return (
    <section id="contact" ref={scope} className="scroll-mt-24 bg-ink py-24 text-ivory lg:py-36">
      <div className="shell">
        {/* Services — the freelance half of the pitch. */}
        <div className="grid gap-8 border-b border-ivory/12 pb-16 sm:grid-cols-3 lg:pb-20">
          {services.map((s) => (
            <div key={s.title} data-reveal="up">
              <h3 className="display text-xl text-ivory">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/55">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-12 pt-16 lg:grid-cols-12 lg:gap-16 lg:pt-20">
          <div className="lg:col-span-7">
            <p
              data-reveal="up"
              className="eyebrow mb-7 !text-ivory/45 before:!bg-terracotta"
            >
              Contact
            </p>

            <SplitHeading
              className="display text-[clamp(2.5rem,7vw,5rem)] leading-[1.02]"
              lines={['Let us build', 'something good.']}
              italicLast
              accentClass="italic text-ember"
            />

            <p
              data-reveal="up"
              className="mt-8 max-w-lg text-pretty leading-relaxed text-ivory/60"
            >
              {profile.availability}. The fastest way to reach me is email — I read
              everything and reply properly.
            </p>

            <div data-reveal="up" className="mt-10">
              <Magnetic strength={0.2}>
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor="email"
                  className="display inline-block break-all text-2xl text-ivory underline decoration-ember/50 decoration-1 underline-offset-8 transition-colors duration-400 hover:text-ember lg:text-4xl"
                >
                  {profile.email}
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-8">
            <dl data-reveal="up" className="space-y-7">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/35">
                  Based in
                </dt>
                <dd className="mt-2 text-ivory/80">{profile.location}</dd>
              </div>

              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/35">
                  GitHub
                </dt>
                <dd className="mt-2">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="open"
                    className="link-wipe text-ivory/80 hover:text-ember"
                  >
                    @{profile.githubHandle}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/35">
                  LinkedIn
                </dt>
                <dd className="mt-2">
                  {linkedinPending ? (
                    <span className="text-sm italic text-ivory/30">
                      Add the URL in content.js
                    </span>
                  ) : (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-cursor="open"
                      className="link-wipe text-ivory/80 hover:text-ember"
                    >
                      Connect
                    </a>
                  )}
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/35">
                  Résumé
                </dt>
                <dd className="mt-2">
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="open"
                    className="link-wipe text-ivory/80 hover:text-ember"
                  >
                    Download PDF
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
