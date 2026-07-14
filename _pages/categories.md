---
layout: page
permalink: /categories/
title: Writing
kicker: Archive
description: Everything I've published, grouped by what it's about.
wide: true
---

<div class="archive">
{% for category in site.categories %}
  {% assign category_name = category | first %}
  {% assign posts = site.categories[category_name] %}

  <section class="archive-group" id="{{ category_name | slugize }}">
    <div class="section-head">
      <h2 class="section-head__title">{{ category_name }}</h2>
      <span class="section-head__count">{{ posts | size }} {% if posts.size == 1 %}post{% else %}posts{% endif %}</span>
    </div>

    <ul class="archive-list">
      {% for post in posts %}
        <li class="archive-item">
          <a class="archive-link" href="{{ site.baseurl }}{{ post.url }}">
            <span class="archive-title">{% if post.title and post.title != "" %}{{ post.title }}{% else %}{{ post.excerpt | strip_html | truncate: 80 }}{% endif %}</span>
            <span class="archive-date">{{ post.date | date: "%b %e, %Y" }}</span>
          </a>
        </li>
      {% endfor %}
    </ul>
  </section>
{% endfor %}
</div>
