---
layout: page
title: About Poy Chang
---
<div class="row">
    <div class="col-md-3 col-sm-3 col-xs-12">
        <img src="https://www.gravatar.com/avatar/c525d15ee116aca696f7af9a926e1788?s=150" class="img-thumbnail"
            alt="Poy Chang" />
    </div>
    <div class="col-md-9 col-sm-9 col-xs-12 center-block">
        <p>Hi, my name is Poy Chang. I am currently conducting a project of enterprise app through Angular and .NET
            Core. As a developer and designer, I believe that keep learning and practicing is the most important thing.
            Reading, watching movies and traveling are also my favorites in my life.</p>
        <p>Please feel free to contact me if you have any comments on my blog :)</p>
        <br>
        <ul class="list-unstyled list-inline">
            {% if site.author.github %}
            <li>
                <a class="btn btn-default btn-sm" href="https://github.com/{{ site.author.github }}">
                    <i class="fa fa-github-alt fa-lg"></i>
                </a>
            </li>
            {% endif %}
            {% if site.author.facebook %}
            <li>
                <a class="btn btn-default btn-sm" href="https://www.facebook.com/{{ site.author.facebook }}">
                    <i class="fa fa-facebook-official fa-lg"></i>
                </a>
            </li>
            {% endif %}
            {% if site.author.linkedin %}
            <li>
                <a class="btn btn-default btn-sm" href="https://www.linkedin.com/in/{{ site.author.linkedin }}">
                    <i class="fa fa-linkedin-square fa-lg"></i>
                </a>
            </li>
            {% endif %}
            {% if site.author.twitter %}
            <li>
                <a class="btn btn-default btn-sm" href="https://twitter.com/{{ site.author.twitter }}">
                    <i class="fa fa-twitter fa-lg"></i>
                </a>
            </li>
            {% endif %}
        </ul>
        <br>
        <p>poypost@gmail.com</p>
        <p>Taipei, Taiwan</p>
    </div>
</div>

<hr>

<!-- github-calendar start -->
<script src="https://cdn.rawgit.com/IonicaBizau/github-calendar/gh-pages/dist/github-calendar.min.js"></script>
<link rel="stylesheet" href="https://cdn.rawgit.com/IonicaBizau/github-calendar/gh-pages/dist/github-calendar.css" />

<!-- Prepare a container for your calendar. -->
<div class="calendar hidden-xs">
    <img src="https://assets-cdn.github.com/images/spinners/octocat-spinner-128.gif" class="spinner" />
    <p class="spinner-text monospace">Loading...</p>
</div>

<script defer>
    GitHubCalendar(".calendar", "poychang");
    setTimeout(() => { document.getElementById('user-activity-overview').setAttribute('style', 'display:none;'); }, 2000);
</script>
<!-- github-calendar end -->
