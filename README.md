# n8n-nodes-quire

This is an n8n community node. It lets you use quire service in your n8n workflows.

Quire is a project management applications that improve your productivity.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

- [Installation](#installation)  
- [Operations](#operations)  
- [Credentials](#credentials)
- [Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Task
- **Create**: Create a new task
- **Get**: Get a task by ID
- **Get by OID**: Get a task by OID
- **Get Many**: Get all tasks in a project
- **Update**: Update an existing task

### Comment
- **Create**: Create a new comment for a task
- **Get Many**: Get all comments for a task

### Project
- **Get Many**: Get all accessible projects

### User
- **Get Many**: Get all accessible users

### Tag
- **Get Many**: Get all tags in a project

### Sublist
- **Get Many**: Get all sublists in a project

### Partner
- **Get Many**: Get all partners in an organization

### Search
- **Find Task in Project**: Find tasks in a project
- **Find User**: Find a user by email or ID

## Credentials

To use this node, you need to set up OAuth2 credentials for Quire in n8n:

1. Log in to Quire and create a Quire App to obtain your Client ID and Client Secret.
2. In n8n, go to the **Credentials** page and add new credentials for **Quire OAuth2 API**.
3. Enter your Quire App's Client ID and Client Secret in the corresponding fields.
4. Copy the **OAuth Redirect URL** shown in n8n and add it to your Quire App's Redirect URI settings.
5. Save the credentials, then click **Connect my account** and authorize access to your Quire projects.

> Reference: [n8n credentials setup guide](https://docs.n8n.io/credentials/add-edit-credentials/)

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Quire App Directory](https://quire.io/apps)

