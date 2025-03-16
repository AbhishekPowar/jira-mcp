# JIRA MCP Integration

A Model Context Protocol (MCP) integration demo that showcases JIRA functionality through custom tools. This project enables seamless interaction with JIRA issues and workflows directly through MCP tools.

## Features

- Create, read, update, and delete JIRA issues
- Search issues using JQL
- Manage issue transitions and status updates
- Create and manage subtasks
- Assign issues to users

## Prerequisites

- Node.js (Latest LTS version recommended)
- JIRA account with API token
- MCP-enabled IDE (e.g:  Cursor)

## Quick Setup

1. Clone the repository:
```bash
git clone <repo>
cd mcp-demo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
JIRA_BASE_URL=your_jira_instance_url
JIRA_EMAIL=your_jira_email
JIRA_API_TOKEN=your_jira_api_token
```

## Integrating with Cursor

1. Open Cursor IDE
2. Navigate to Cursor Settings
3. Scroll down to the "MCP" section
4. Click on "Add new MCP Server"
5. Fill in the following details:
   - Name: `jira-mcp`
   - Type: `command`
   - Command: `node <path to server.js>`
   
Example command:
```bash
node /Users/username/Desktop/jira-mcp/src/server.js
```

Note: Replace the path with the actual path to your `server.js` file.

## Project Structure

```
/src
├── server.js     # Main server setup and configuration
├── jira/         # JIRA integration tools and handlers
└── hello/        # Example hello world implementation
```

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start development server with hot reload

## JIRA Workflow

1. Issue Management:
   - Create well-structured tickets
   - Include clear problem statements
   - Document business value and impact
   - Outline implementation approach

2. Task Organization:
   - Break down into manageable subtasks
   - Keep focused and achievable goals
   - Use consistent naming conventions
   - Regular status updates
  
## License

MIT

## Author

Abhishek Powar 