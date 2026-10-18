import Script from 'next/script'

export default function NewsletterSignup() {
  return (
    <section className="mt-16">
      <div className="min-h-[52px]">
        <div className="ml-embedded" data-form="k58SuA" />
      </div>
      <Script id="mailerlite-universal" strategy="afterInteractive">
        {`(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
.push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
ml('account', '2721228');`}
      </Script>
    </section>
  )
}
