#!/usr/bin/env node

import {
  ASSIGN_ISSUE_TOOL,
  CREATE_JIRA_ISSUE_TOOL,
  CREATE_SUBTASK_TOOL,
  DELETE_JIRA_ISSUE_TOOL,
  GET_JIRA_ISSUE_TOOL,
  GET_TRANSITIONS_TOOL,
  SEARCH_JIRA_ISSUES_TOOL,
  TRANSITION_ISSUE_TOOL,
  UPDATE_JIRA_ISSUE_TOOL,
  assignJiraIssue,
  createJiraIssue,
  createJiraSubtask,
  deleteJiraIssue,
  getJiraIssue,
  getJiraTransitions,
  searchJiraIssues,
  transitionJiraIssue,
  updateJiraIssue
} from "./jira/tools.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
// Import handlers and tools
import { handleHelloWorld } from "./hello/handler.js";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.error('Server Debug - Dotenv result:', result);
console.error('Server Debug - JIRA Config:', {
  baseUrl: process.env.JIRA_BASE_URL,
  email: process.env.JIRA_EMAIL,
  hasToken: !!process.env.JIRA_API_TOKEN
});



// Define the HelloWorld tool
const HELLO_WORLD_TOOL = {
  name: "hello_world",
  description: "A simple greeting tool that says hello",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the person to greet"
      }
    },
    required: ["name"]
  }
};

// Server implementation
const server = new Server(
  {
    name: "example-servers/jira-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    HELLO_WORLD_TOOL,
    CREATE_JIRA_ISSUE_TOOL,
    GET_JIRA_ISSUE_TOOL,
    UPDATE_JIRA_ISSUE_TOOL,
    DELETE_JIRA_ISSUE_TOOL,
    SEARCH_JIRA_ISSUES_TOOL,
    GET_TRANSITIONS_TOOL,
    TRANSITION_ISSUE_TOOL,
    ASSIGN_ISSUE_TOOL,
    CREATE_SUBTASK_TOOL
  ],
}));

const handlerMap = {
  "hello_world": handleHelloWorld,
  "create_jira_issue": createJiraIssue,
  "get_jira_issue": getJiraIssue,
  "update_jira_issue": updateJiraIssue,
  "delete_jira_issue": deleteJiraIssue,
  "search_jira_issues": searchJiraIssues,
  "get_jira_transitions": getJiraTransitions,
  "transition_jira_issue": transitionJiraIssue,
  "assign_jira_issue": assignJiraIssue,
  "create_jira_subtask": createJiraSubtask
};

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error("No arguments provided");
    }

    const handler = handlerMap[name];
    if (!handler) {
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }

    const result = await handler(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      isError: false,
    };

  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("JIRA MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
}); 