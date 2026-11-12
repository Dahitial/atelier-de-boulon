# Code signing policy / Politique de signature

Free code signing provided by [SignPath.io](https://signpath.io), certificate by
[SignPath Foundation](https://signpath.org).

*(This statement applies once the project's application to SignPath Foundation is accepted.
Until then, the installers are not signed.)*

## What is signed

Only the Windows installers built from this repository by the GitHub Actions workflow
[`.github/workflows/setup.yml`](.github/workflows/setup.yml):
`AtelierBoulon-<LEVEL>-Setup-<version>.exe`. Nothing built on a personal computer is signed.

## Team roles

| Role | Members |
|---|---|
| Committers and reviewers | [Dahitial](https://github.com/Dahitial) |
| Approvers | [Dahitial](https://github.com/Dahitial) |

Every member uses multi-factor authentication on GitHub and on SignPath.
Each signing request is approved by hand by an approver.

## Privacy policy

This program will not transfer any information to other networked systems unless specifically
requested by the user or the person installing or operating it, with one exception: to speak aloud,
the game uses the speech synthesis of Microsoft Edge. When an online "natural" Edge voice is available,
the sentences to be spoken (which may include the child's first name) are processed by Microsoft's speech
service, under the [Microsoft Privacy Statement](https://privacy.microsoft.com/). Without an Internet
connection, local Windows voices are used and no data leaves the computer.

The game creates no account and contains no advertising, analytics or telemetry. Children's progress is
stored only on the computer, in the browser's local storage.

---

*En français* : seuls les Setup construits sur GitHub par le workflow `setup.yml` sont signés, après
une approbation manuelle. Le jeu n'envoie aucune donnée sur Internet, sauf les phrases dites par une voix
en ligne de Microsoft Edge quand elle est disponible.
