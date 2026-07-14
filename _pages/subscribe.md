---
layout: page
title: Subscribe
permalink: /subscribe/
kicker: Newsletter
description: "Long-form notes on building companies and the products inside them: the engineering, the org, and the calls I got wrong. Occasional, never a treadmill."
---

<div class="subscribe">
  <form
    class="subscribe__form"
    id="subscribeForm"
    action="https://docs.google.com/forms/d/e/1FAIpQLSdr5w857MWH2bg_J3XSty1DSjG1eT4dI9TMKTdw6lU1-1L8NQ/formResponse"
    method="post"
    target="subscribeSink"
  >
    <div class="field">
      <label class="field__label" for="sub-email">Email</label>
      <input class="field__input" type="email" id="sub-email" name="emailAddress" placeholder="you@company.com" required autocomplete="email">
    </div>

    <div class="field">
      <label class="field__label" for="sub-name">Name</label>
      <input class="field__input" type="text" id="sub-name" name="entry.1631746329" placeholder="Your name" required autocomplete="name">
    </div>

    <div class="field">
      <label class="field__label" for="sub-phone">Phone <span class="muted">(optional)</span></label>
      <input class="field__input" type="tel" id="sub-phone" name="entry.120976480" placeholder="Optional" autocomplete="tel">
    </div>

    <input type="hidden" name="fvv" value="1">
    <input type="hidden" name="pageHistory" value="0">
    <input type="hidden" name="fbzx" value="-1">

    <button class="btn btn--primary" type="submit" id="subscribeBtn">Subscribe</button>

    <p class="subscribe__note">
      No spam, and your address goes nowhere else. Unsubscribe by replying to any email.
    </p>
  </form>

  <div class="subscribe__success" id="subscribeSuccess" role="status">
    <span class="subscribe__check" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>

    <h2 class="subscribe__success-title">You&rsquo;re on the list.</h2>

    <p class="subscribe__success-body">
      The next essay will land in your inbox. In the meantime, the archive is open.
    </p>

    <a class="btn btn--ghost" href="{{ site.baseurl }}/categories/">Browse the archive</a>
  </div>

  <iframe class="subscribe__sink" name="subscribeSink" id="subscribeSink" title="Form target" tabindex="-1" aria-hidden="true"></iframe>
</div>

<script>
  (function () {
    var form = document.getElementById("subscribeForm");
    var sink = document.getElementById("subscribeSink");
    var success = document.getElementById("subscribeSuccess");
    var button = document.getElementById("subscribeBtn");
    if (!form || !sink) return;

    var submitted = false;

    // The browser's own constraint validation gates this handler, so by
    // the time it runs the POST is already on its way to Google inside
    // the hidden iframe; the page itself never navigates.
    form.addEventListener("submit", function () {
      submitted = true;
      button.disabled = true;
      button.textContent = "Subscribing…";
    });

    // We can't read the iframe's body (cross-origin), but its load event
    // only fires once Google has answered the POST. That's the signal.
    sink.addEventListener("load", function () {
      if (!submitted) return;
      form.style.display = "none";
      success.classList.add("is-shown");
    });
  })();
</script>
