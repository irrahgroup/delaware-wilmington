# @gptmaker/n8n-nodes-gptmaker

Community node for the GPTMaker API.

Repository: https://github.com/irrahgroup/delaware-wilmington

## Features

- Native n8n resource/operation structure
- Bearer token authentication
- Dynamic dropdowns for Workspace and Agent
- Support for Workspace, Agent, Channel, Chat, Intention, Interaction, and Training resources
- Compatible with manual execution and multi-item workflows

## Supported Resources

### Workspace
- Get many workspaces
- Get workspace credits balance

### Agent
- Create, get, update, delete, activate, inactivate
- Conversation and context message actions
- Get credits spent
- Get/update settings
- Get/update webhooks

### Channel
- Create in agent or workspace context
- Get many by workspace
- Update/delete channel
- Get/update channel config

### Chat
- Get many chats by workspace
- List messages
- Send/edit/delete message
- Delete chat messages
- Delete chat
- Start/stop human support

### Intention
- List
- Create
- Update
- Delete

### Interaction
- List by workspace
- Delete

### Training
- Create
- Get many
- Update (TEXT)
- Delete

## Authentication

This node uses one credential:

- GPTMaker API
  - API Token

Token setup guide (official docs):

- https://developer.gptmaker.ai/api-reference/introduction#autentica%C3%A7%C3%A3o

Credential setup flow in n8n:

1. Create a new `GPTMaker API` credential.
2. Paste your GPTMaker API token into `API Token`.
3. Save and test the credential.

## Installation

```bash
npm install @gptmaker/n8n-nodes-gptmaker
```

Restart n8n after installation.

## Example Workflow

A sanitized workflow example is included at the project root:

- `workflow-example-gptmaker.json`

Use this file as a base for Creator Portal submission and internal QA.

## Publishing

Current release strategy: manual publish.

```bash
npm run lint
npm run build
npm publish --access public
```

Provenance-ready workflow is included for GitHub Actions:

- `.github/workflows/publish-provenance.yml`

It uses `npm publish --provenance --access public` and requires `NPM_TOKEN` in repository secrets.

## Development

```bash
npm run build
npm run dev
npm run lint
```

Project structure:

- `nodes/GptMaker/GptMaker.node.ts`: main node definition
- `nodes/GptMaker/GptMakerApi.credentials.ts`: credential definition
- `nodes/GptMaker/descriptions/`: node fields and operations
- `nodes/GptMaker/resources/`: execution logic
- `nodes/GptMaker/Helpers.ts`: shared API request helper

## License

MIT
