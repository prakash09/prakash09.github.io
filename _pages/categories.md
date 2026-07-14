---
layout: page
permalink: /categories/
title: Writing
kicker: Archive
description: Everything I've published, newest first.
wide: true
---

<div class="archive">
  {% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}

  {% for year in posts_by_year %}
    <section class="archive-group" id="y{{ year.name }}">
      <div class="section-head">
        <h2 class="section-head__title">{{ year.name }}</h2>
        <span class="section-head__count">{{ year.items | size }} {% if year.items.size == 1 %}post{% else %}posts{% endif %}</span>
      </div>

      <ul class="archive-list">
        {% for post in year.items %}
          <li class="archive-item">
            <a class="archive-link" href="{{ site.baseurl }}{{ post.url }}">
              <span class="archive-title">{% if post.title and post.title != "" %}{{ post.title }}{% else %}{{ post.excerpt | strip_html | truncate: 80 }}{% endif %}</span>
              <span class="archive-meta">
                <span class="archive-read">{{ post.content | number_of_words | divided_by: 200 | plus: 1 }} min</span>
                <span class="archive-date">{{ post.date | date: "%b %e" }}</span>
              </span>
            </a>
          </li>
        {% endfor %}
      </ul>
    </section>
  {% endfor %}

  {% comment %}
    Posts currently carry no categories. If any are added later, they get
    their own grouped index here automatically — and the category chips in
    the post footer start linking somewhere real.
  {% endcomment %}
  {% if site.categories.size > 0 %}
    <section class="archive-group">
      <div class="section-head">
        <h2 class="section-head__title">By topic</h2>
        <span class="section-head__count">{{ site.categories | size }} topics</span>
      </div>

      {% for category in site.categories %}
        {% assign category_name = category | first %}
        {% assign posts = site.categories[category_name] %}

        <div id="{{ category_name | slugize }}">
          <h3 class="archive-topic">{{ category_name }} <span class="archive-topic__count">{{ posts | size }}</span></h3>

          <ul class="archive-list">
            {% for post in posts %}
              <li class="archive-item">
                <a class="archive-link" href="{{ site.baseurl }}{{ post.url }}">
                  <span class="archive-title">{{ post.title }}</span>
                  <span class="archive-meta"><span class="archive-date">{{ post.date | date: "%b %e, %Y" }}</span></span>
                </a>
              </li>
            {% endfor %}
          </ul>
        </div>
      {% endfor %}
    </section>
  {% endif %}
</div>
