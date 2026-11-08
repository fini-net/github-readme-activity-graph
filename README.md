<p align="center">
    <img src="asset/logo.svg" height="150" alt="github-readme-activity-graph logo">
</p>

A dynamically generated activity graph to show your GitHub activities of last 31 days.

## Table of contents

- [Table of contents](#table-of-contents)
- [How to Use](#how-to-use)
- [Use themes](#use-themes)
- [Available Themes](#available-themes)
- [Customization](#customization)
  - [Common Options](#common-options)
- [Deploy on your own Replit instance](#deploy-on-your-own-replit-instance)
  - [Follow the steps](#follow-the-steps)
- [Deploy on your own Vercel instance](#deploy-on-your-own-vercel-instance)
  - [First Method](#first-method)
  - [Second Method](#second-method)
  - [Finally](#finally)
- [Self-hosting on DigitalOcean App Platform](#self-hosting-on-digitalocean-app-platform)
  - [Deploy with OpenTofu / Terraform](#deploy-with-opentofu--terraform)
  - [Prerequisites](#prerequisites)
  - [Deploy](#deploy)
  - [Set the GitHub token](#set-the-github-token)
  - [Point a custom domain (optional)](#point-a-custom-domain-optional)
  - [Updating the deployment](#updating-the-deployment)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [Upstream Core Team 💻](#upstream-core-team-)
- [Upstream Contributors ✨](#upstream-contributors-)
- [Resources Used to build this project](#resources-used-to-build-this-project)
- [Upstream Star History](#upstream-star-history)
  - [Made with ❤ and TypeScript](#made-with--and-typescript-)

## How to Use

Just paste the following URL in your profile readme and you are good to go.

**Pass your `username` in the URL**

```md
[![chicks-net's github activity graph](https://activity-graph-hftzl.ondigitalocean.app/graph?username=chicks-net)](https://github.com/fini-net/github-readme-activity-graph)
```

## Use themes

_`username=chicks-net&theme=theme_name`_

```md
[![chicks-net's github activity graph](https://activity-graph-hftzl.ondigitalocean.app/graph?username=chicks-net&theme=dracula)](https://github.com/fini-net/github-readme-activity-graph)
```

[Manual Customization](#customization) is also available

## Available Themes

|            Name            |                            Preview                             |
| :------------------------: | :------------------------------------------------------------: |
| **Default (cotton candy)** |    <img src="./asset/default.svg" height=250 alt="graph"/>     |
|         **react**          |     <img src="./asset/react.png" height=250 alt="graph"/>      |
|       **react-dark**       |   <img src="./asset/react-dark.svg" height=250 alt="graph"/>   |
|         **github**         |     <img src="./asset/github.svg" height=250 alt="graph"/>     |
|     **github-compact**     | <img src="./asset/github-compact.svg" height=250 alt="graph"/> |
|         **xcode**          |     <img src="./asset/xcode.svg" height=250 alt="graph"/>      |
|         **rogue**          |     <img src="./asset/rogue.svg" height=250 alt="graph"/>      |
|         **merko**          |     <img src="./asset/merko.png" height=250 alt="graph"/>      |
|          **vue**           |      <img src="./asset/vue.png" height=250 alt="graph"/>       |
|      **tokyo-night**       |  <img src="./asset/tokyo-night.png" height=250 alt="graph"/>   |
|     **high-contrast**      | <img src="./asset/high-contrast.png" height=250 alt="graph"/>  |

For more themes, check out [THEMES.md](./THEMES.md)

## Customization

Customize the appearance of your Activity Graph however you want with URL params.

### Common Options

|   Arguments    |                                      Description                                       |                 Type of Value                  |
| :------------: | :------------------------------------------------------------------------------------: | :--------------------------------------------: |
|   `bg_color`   |                                card's background color                                 |             hex code (without `#`)             |
| `border_color` |                                  card's border color                                   |             hex code (without `#`)             |
|    `color`     |                                graph card's text color                                 |             hex code (without `#`)             |
| `title_color`  |                                graph card's title color                                |             hex code (without `#`)             |
|     `line`     |                                   graph's line color                                   |             hex code (without `#`)             |
|    `point`     |                             color of points on line graph                              |             hex code (without `#`)             |
|  `area_color`  |                           color of the area under the graph                            |             hex code (without `#`)             |
|     `area`     |                               shows area under the graph                               |           boolean (default: `false`)           |
| `hide_border`  |                       makes the border of the graph transparent                        |           boolean (default: `false`)           |
|  `hide_title`  |                           sets the title to an empty string                            |           boolean (default: `false`)           |
| `custom_title` |                              set the title to any string                               |                     string                     |
|    `theme`     |                     name of [available themes](#available-themes)                      |                     string                     |
|    `radius`    |                                 border radius of graph                                 |            number (0-16 inclusive)             |
|    `height`    |                                  height of the graph                                   |           number (200-600 inclusive)           |
|     `days`     |                           number of to days display on graph                           | number between (1 - 90) [Recommended below 40] |
|     `from`     |                            date from which the graph starts                            |              format `YYYY-MM-DD`               |
|      `to`      |                             date where the graph will end                              |              format `YYYY-MM-DD`               |
|     `grid`     |                                       show grid                                        |           boolean (default: `true`)            |
|    `ghosts`    | number of prior windows to overlay as faded grey "ghost" lines behind the current line |     number (0 - 6 inclusive, default: `0`)     |

⚠ **For `custom_title` please make sure that you are using %20 for spaces**

Example:

**`custom_title=This%20is%20a%20title`**

```md
[![chicks-net's github activity graph](https://activity-graph-hftzl.ondigitalocean.app/graph?username=chicks-net&custom_title=This%20is%20a%20title&hide_border=true)](https://github.com/fini-net/github-readme-activity-graph)
```

**Example:**

```md
[![chicks-net's github activity graph](https://activity-graph-hftzl.ondigitalocean.app/graph?username=chicks-net&bg_color=fffff0&color=708090&line=24292e&point=24292e&area=true&border_color=ff0000)](https://github.com/fini-net/github-readme-activity-graph)
```

### Ghost lines (`ghosts=N`)

Add `&ghosts=N` to overlay the previous `N` contribution windows as faded grey "ghost" lines behind the current line, so you can see at a glance how this window's pace compares to previous ones:

```md
[![chicks-net's github activity graph](https://activity-graph-hftzl.ondigitalocean.app/graph?username=chicks-net&ghosts=2)](https://github.com/fini-net/github-readme-activity-graph)
```

- Each ghost is the current window shifted back by its own length — a 31-day graph with `ghosts=2` shows the current 31 days plus the two 31-day windows before it — index-aligned on the X-axis. Works with any `days` value and custom `from`/`to`.
- Ghosts are drawn in a fixed grey (`#9e9e9e`, ~35% opacity, thinner stroke) regardless of theme, with no points or area fill.
- Ghost data shares the Y-axis scale, so a busy prior window can flatten a quiet current one.
- X-axis labels reflect the current window only; ghosts are unlabeled.
- GitHub only serves contributions for about the last year, so ghost windows reaching further back are skipped — fewer lines than requested may appear for long windows.

## Deploy on your own Replit instance

<details>
<summary><b>Step-by-step instructions for deploying to Replit (from UI)</b></summary>

### Follow the steps

1. Sign in to Replit or create a new account at [replit.com](https://replit.com)
2. Click the Deploy button below

   <a href="https://repl.it/github/fini-net/github-readme-activity-graph">
     <img alt="Run on Repl.it" src="https://repl.it/badge/github/fini-net/github-readme-activity-graph" style="height: 40px; width: 190px;" />
   </a>

3. On the page that comes up, choose language as `Node.js` and then click `Import from GitHub` Button

    ![Replit](./asset/replit1.png)

4. Visit [this link](https://github.com/settings/tokens/new?description=GitHub%20Readme%20Activity%20Graph) to create a new Personal Access Token
5. Scroll to the bottom and click "**Generate token**"
6. Wait clone done and add `Secrets` with your `Github token`

    ![Secrets](./asset/replit2.png)

7. Click the green `RUN` button on top, the console will run and at last the url will shows on the right
8. Now just add the following to your profile readme and you're good to go

```md
![Github Activity Graph](<url from step 5>/graph?username=<username>)
```

</details>

## Deploy on your own Vercel instance

<details>
<summary><b>Step-by-step instructions for deploying to Vercel (from UI)</b></summary>

### First Method

1. Go to [vercel.com](https://vercel.com/).
2. Click on `Log in`.
    ![image](https://user-images.githubusercontent.com/3431285/235332307-a98adccf-ac8e-4c05-8fae-b14e7d0b81e8.png)
3. Sign in with GitHub by pressing `Continue with GitHub`.
    ![image](https://user-images.githubusercontent.com/3431285/235332299-70f52a0f-ffb9-4070-ae85-a4646a2bb1bf.png)
4. Sign in to GitHub and allow access to all repositories if prompted.
5. Fork this repo.
6. Go back to your [Vercel dashboard](https://vercel.com/dashboard).
7. To import a project, click the `Add New...` button and select the `Project` option.
    ![image](https://user-images.githubusercontent.com/3431285/235332320-d80e62c9-a7d9-45f3-8bef-b8950c4c9093.png)
8. Click the `Continue with GitHub` button, search for the required Git Repository and import it by clicking the `Import` button.
    ![image](https://user-images.githubusercontent.com/3431285/235332373-3f28309c-d70b-490e-aa40-4d55ad429d5a.png)
9. Create a [personal access token (PAT)](https://github.com/settings/tokens/new) and enable the `repo` permissions (this allows access to see private repo stats).
    ![image](https://user-images.githubusercontent.com/3431285/235332420-df83a424-009b-4f69-bbb2-54e807bff701.png)
10. Add the PAT as an environment variable named `TOKEN`.
    ![image](https://user-images.githubusercontent.com/3431285/235332471-6915abf8-04fe-4f5e-b734-191388a77140.png)
11. Click deploy, and you're good to go. See your domains to use the API!

### Second Method

Alternatively, click the button below and follow the instructions.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/fini-net/github-readme-activity-graph)

After the deployment is complete:

1. Click the `Continue to Dashboard` button
   ![image](https://user-images.githubusercontent.com/3431285/235332677-addafd5f-dce8-4823-9927-05657eec2084.png)
2. In the `Settings` tab, click on `Environment Variables` and follow steps `9.` and `10.` of `First Method`.
   ![image](https://user-images.githubusercontent.com/3431285/235332731-03207969-b16e-42e4-858a-67b05af7bcc8.png)
3. Go to `Deployments` tab and redeploy the project.
   ![image](https://user-images.githubusercontent.com/3431285/235332761-1d3ae9c5-0138-447f-a41a-601c73ef3104.png)

### Finally

Now just add the following to your profile readme and you're good to go.

```md
![Github Activity Graph](<{your_own_domain_name}.vercel.app>/graph?username=<username>)
```

</details>

## Self-hosting on DigitalOcean App Platform

<details>
<summary><b>Step-by-step instructions for self-hosting on DigitalOcean App Platform</b></summary>

This fork ships a [Dockerfile](./Dockerfile) and an [App Platform spec](./.do/app.yaml) so the service can run as a container on DigitalOcean (or any other container host — podman, k8s, fly.io, etc.) instead of depending on the upstream Vercel deployment. The upstream deployment is currently returning HTTP 402 because the maintainer's account is billing-locked ([Ashutosh00710#257](https://github.com/Ashutosh00710/github-readme-activity-graph/issues/257), [Ashutosh00710#259](https://github.com/Ashutosh00710/github-readme-activity-graph/issues/259)). See [chicks-net/www-chicks-net#371](https://github.com/chicks-net/www-chicks-net/issues/371) for the full rationale.

The app is a plain Express 5 server (`src/main.ts`) with no Vercel-specific runtime APIs, so it runs unmodified as a long-running Node process inside the container.

### Deploy with OpenTofu / Terraform

If wrangling `doctl` commands by hand isn't your thing, there's a ready-to-use module over in [`fini-net/fini-infra`](https://github.com/fini-net/fini-infra/tree/main/l7_application/activity-graph) (`l7_application/activity-graph`). It provisions the same `apps-s-1vcpu-0.5gb` container app from this repo's `Dockerfile` as infrastructure-as-code, and rather than pasting the GitHub PAT into the dashboard it pulls your token out of 1Password via the `onepassword` provider — so the secret never lands in code or version control. Check that directory's `README.md` and `main.tf` for the variables (`github_repo`, `github_branch`, `http_port`, `region`, etc.) and run a plain `tofu apply` (or `terraform apply`) to bring the app up. The manual `doctl` flow below does the same job; pick whichever fits your workflow.

### Prerequisites

- A [DigitalOcean](https://cloud.digitalocean.com/) account
- [`doctl`](https://docs.digitalocean.com/reference/doctl/) installed and authenticated (`doctl auth init`)
- A [GitHub Personal Access Token](https://github.com/settings/tokens) with `read:user` scope (the service uses it as a Bearer token against `api.github.com/graphql`; see `src/fetcher.ts:46`)

### Deploy

```sh
doctl apps create --spec .do/app.yaml
```

App Platform builds the image from the repo's `Dockerfile`, starts one `apps-s-1vcpu-0.5gb` instance ($5/mo, 512 MiB) in `nyc`, and assigns a public URL of the form `activity-graph-<random>.ondigitalocean.app`. Pushes to the `deploy` branch redeploy automatically (`deploy_on_push: true`).

At this point the app is live but returns the graceful "Can't fetch any contribution" error-graph SVG because `TOKEN` is empty.

### Set the GitHub token

Set the `TOKEN` secret via `doctl` (the spec declares it as `type: SECRET`, so the value is encrypted at rest and never appears in `git`):

```sh
APP_ID=$(doctl apps list --format ID,Spec.Name --no-header | awk '$2=="activity-graph"{print $1; exit}')
doctl apps update "$APP_ID" --spec .do/app.yaml \
  --set-env TOKEN=<your-github-pat>
```

Or via the App Platform dashboard: **Settings → App-Level Environment Variables → Add → `TOKEN` = `<your-pat>`, type Secret**.

After the redeploy, `GET https://activity-graph-<random>.ondigitalocean.app/graph?username=<your-name>&theme=github-compact` returns a real contribution-graph SVG.

### Point a custom domain (optional)

The spec intentionally omits a `domains:` block so first-deploy Just Works. To add `activity-graph.chicks.net` (or similar) once DNS is ready, add to `.do/app.yaml`:

```yaml
domains:
- domain: activity-graph.chicks.net
  type: PRIMARY
```

then add a CNAME on the chicks.net side pointing at the `.ondigitalocean.app` hostname and run `doctl apps update "$APP_ID" --spec .do/app.yaml --set-env TOKEN=<your-pat>`.

### Updating the deployment

- **Code change on `deploy` branch:** App Platform redeploys automatically on push (`deploy_on_push: true`).
- **Spec change:** `doctl apps update "$APP_ID" --spec .do/app.yaml --set-env TOKEN=<your-pat>`. ⚠ Always pass `--set-env TOKEN=...` when updating from the spec — the checked-in spec keeps `TOKEN`'s value empty (to keep the secret out of git), so omitting the flag resets the secret and breaks `/graph` (it returns the "Can't fetch" error-graph SVG) until `TOKEN` is set again. Alternatively, update the spec via the dashboard, which preserves existing secrets.
- **Spec validation in CI:** the [Validate App Spec](./.github/workflows/validate-app-spec.yml) workflow checks `.do/app.yaml` on PRs. Without a `DIGITALOCEAN_ACCESS_TOKEN` repo secret it falls back to a YAML syntax check; with the secret it runs `doctl apps spec validate`.

</details>

## Contributing

Please read through our [contributing guidelines](./CONTRIBUTING.md). Directions are included for opening issues, coding standards, and notes on development.

## Acknowledgements

This project is a fork of [Ashutosh00710/github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph) by Ashutosh Dwivedi and its contributors. Full credit for the original design and implementation belongs upstream — this fork just keeps a good thing running after the upstream free-tier deployments went away.

## Upstream Core Team 💻

- [Ashutosh Dwivedi](https://github.com/Ashutosh00710) — [📆](https://allcontributors.org/en/reference/emoji-key/#contributions "Project Management") [💻](https://allcontributors.org/en/reference/emoji-key/#contributions "Code") [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation") [🤔](https://allcontributors.org/en/reference/emoji-key/#contributions "Ideas & Planning") [⚠](https://allcontributors.org/en/reference/emoji-key/#contributions "Testing")
- [Kshitij Srivastava](https://github.com/kshitij978) — [📆](https://allcontributors.org/en/reference/emoji-key/#contributions "Project Management") [💻](https://allcontributors.org/en/reference/emoji-key/#contributions "Code") [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation") [🎨](https://allcontributors.org/en/reference/emoji-key/#contributions "Design")

## Upstream Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/en/reference/emoji-key/)):

- [Upamanyu Das](https://github.com/tintindas) — [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation")
- [Jonah Lawrence](https://github.com/DenverCoder1) — [💻](https://allcontributors.org/en/reference/emoji-key/#contributions "Code") [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation")
- [Milind Modi](https://github.com/MilindModi) — [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation")
- [Vaibhav](https://github.com/Vaibhav-afk) — [💻](https://allcontributors.org/en/reference/emoji-key/#contributions "Code") [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation")
- [Jacob Philpott](https://github.com/jgphilpott) — [💻](https://allcontributors.org/en/reference/emoji-key/#contributions "Code") [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation")
- [Sonu Kumar](https://github.com/SonuKumar81800) — [🎨](https://allcontributors.org/en/reference/emoji-key/#contributions "Design") [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation")
- [Mykola Symon](https://github.com/andinoriel) — [💻](https://allcontributors.org/en/reference/emoji-key/#contributions "Code")
- [Sreyan Ghosh](https://github.com/sreyan-ghosh) — [🎨](https://allcontributors.org/en/reference/emoji-key/#contributions "Design")
- [Anant Mishra](https://github.com/Anant-mishra1729) — [🎨](https://allcontributors.org/en/reference/emoji-key/#contributions "Design")
- [Skyler](https://github.com/SKewLinez) — [🎨](https://allcontributors.org/en/reference/emoji-key/#contributions "Design")
- [Iryna Mykoliuk](https://github.com/eliely) — [🎨](https://allcontributors.org/en/reference/emoji-key/#contributions "Design")
- [Dalpat Rathore](https://github.com/DalpatRathore) — [🎨](https://allcontributors.org/en/reference/emoji-key/#contributions "Design") [💻](https://allcontributors.org/en/reference/emoji-key/#contributions "Code")
- [Dmitriy Fishman](https://github.com/fishmandev) — [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation")
- [MagicLike](https://github.com/MagicLike) — [🎨](https://allcontributors.org/en/reference/emoji-key/#contributions "Design") [💻](https://allcontributors.org/en/reference/emoji-key/#contributions "Code")
- [OnkarRuikar](https://github.com/OnkarRuikar) — [💻](https://allcontributors.org/en/reference/emoji-key/#contributions "Code")
- [valetzx](https://github.com/valetzx) — [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation")
- [tranthaituananh](https://github.com/tranthaituananh) — [🎨](https://allcontributors.org/en/reference/emoji-key/#contributions "Design") [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation")
- [polekstulod](https://github.com/polekstulod) — [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation")
- [jmloudis](https://github.com/jmloudis) — [💻](https://allcontributors.org/en/reference/emoji-key/#contributions "Code")
- [fabianocouto](https://github.com/fabianocouto) — [💻](https://allcontributors.org/en/reference/emoji-key/#contributions "Code") [📖](https://allcontributors.org/en/reference/emoji-key/#contributions "Documentation")

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Resources Used to build this project

|      Purpose       |  Library Name   |                   Link                    |
| :----------------: | :-------------: | :---------------------------------------: |
| Graph Construction | **CHARTIST.JS** | <https://github.com/gionkunz/chartist-js> |

---

## Upstream Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Ashutosh00710/github-readme-activity-graph&type=Timeline)](https://star-history.com/#Ashutosh00710/github-readme-activity-graph&Timeline)

### Made with ❤ and TypeScript <img src="https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg" width="25" alt="TypeScript">
