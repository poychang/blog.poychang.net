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
        <p>Poy Chang is a software developer from Taiwan. With more than 10 years of Software Development experience, currently focuses on develop and architect for the manufacturing industry. He also a core member of the technology community STUDY4. In 2020 he organized the biggest technical conference with STUDY4 community ever done, .NET Conf. For 3 days conference has over 500 attendees and speakers attended. Poy loves to share his technical skills with community and maintains open source projects on GitHub. He believes that keep learning and practicing is the most important thing. In his spare time, Poy plays basketball, has fun with his son and enjoy coding.</p>
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
                    <i class="fa fa-linkedin fa-lg"></i>
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

<!-- githubchart-api start -->
<!-- https://github.com/2016rshah/githubchart-api -->
<div class="col-md-12 col-sm-12 col-xs-12">
    <img src="https://ghchart.rshah.org/poychang" alt="Poy Chang's GitHub Chart" />
</div>
<!-- githubchart-api end -->
