import { jiraService } from './jira-api.js';

// Tool Definitions
export const CREATE_JIRA_ISSUE_TOOL = {
  name: "create_jira_issue",
  description: "Create a new JIRA issue",
  inputSchema: {
    type: "object",
    properties: {
      projectKey: {
        type: "string",
        description: "The project key where the issue will be created"
      },
      summary: {
        type: "string",
        description: "The summary/title of the issue"
      },
      description: {
        type: "string",
        description: "The description of the issue"
      },
      issueType: {
        type: "string",
        description: "The type of issue (e.g., 'Task', 'Bug')",
        default: "Task"
      }
    },
    required: ["projectKey", "summary"]
  }
};

export const GET_JIRA_ISSUE_TOOL = {
  name: "get_jira_issue",
  description: "Get details of a JIRA issue",
  inputSchema: {
    type: "object",
    properties: {
      issueIdOrKey: {
        type: "string",
        description: "The ID or key of the issue to retrieve"
      }
    },
    required: ["issueIdOrKey"]
  }
};

export const UPDATE_JIRA_ISSUE_TOOL = {
  name: "update_jira_issue",
  description: "Update an existing JIRA issue",
  inputSchema: {
    type: "object",
    properties: {
      issueIdOrKey: {
        type: "string",
        description: "The ID or key of the issue to update"
      },
      summary: {
        type: "string",
        description: "The updated summary/title of the issue"
      },
      description: {
        type: "string",
        description: "The updated description of the issue"
      }
    },
    required: ["issueIdOrKey"]
  }
};

export const DELETE_JIRA_ISSUE_TOOL = {
  name: "delete_jira_issue",
  description: "Delete a JIRA issue",
  inputSchema: {
    type: "object",
    properties: {
      issueIdOrKey: {
        type: "string",
        description: "The ID or key of the issue to delete"
      }
    },
    required: ["issueIdOrKey"]
  }
};

export const SEARCH_JIRA_ISSUES_TOOL = {
  name: "search_jira_issues",
  description: "Search for JIRA issues using JQL",
  inputSchema: {
    type: "object",
    properties: {
      jql: {
        type: "string",
        description: "The JQL query to search issues"
      },
      maxResults: {
        type: "number",
        description: "Maximum number of results to return",
        default: 50
      }
    },
    required: ["jql"]
  }
};

export const GET_TRANSITIONS_TOOL = {
  name: "get_jira_transitions",
  description: "Get available transitions for a JIRA issue",
  inputSchema: {
    type: "object",
    properties: {
      issueIdOrKey: {
        type: "string",
        description: "The ID or key of the issue"
      }
    },
    required: ["issueIdOrKey"]
  }
};

export const TRANSITION_ISSUE_TOOL = {
  name: "transition_jira_issue",
  description: "Transition a JIRA issue to a new status",
  inputSchema: {
    type: "object",
    properties: {
      issueIdOrKey: {
        type: "string",
        description: "The ID or key of the issue"
      },
      targetStatus: {
        type: "string",
        description: "The target status name (e.g., 'In Progress', 'Done')"
      }
    },
    required: ["issueIdOrKey", "targetStatus"]
  }
};

export const ASSIGN_ISSUE_TOOL = {
  name: "assign_jira_issue",
  description: "Assign a JIRA issue to a user",
  inputSchema: {
    type: "object",
    properties: {
      issueIdOrKey: {
        type: "string",
        description: "The ID or key of the issue to assign"
      },
      accountId: {
        type: "string",
        description: "The account ID of the user to assign the issue to"
      }
    },
    required: ["issueIdOrKey", "accountId"]
  }
};

export const CREATE_SUBTASK_TOOL = {
  name: "create_jira_subtask",
  description: "Create a subtask for a JIRA issue",
  inputSchema: {
    type: "object",
    properties: {
      parentIssueKey: {
        type: "string",
        description: "The key of the parent issue"
      },
      summary: {
        type: "string",
        description: "The summary/title of the subtask"
      },
      description: {
        type: "string",
        description: "The description of the subtask"
      }
    },
    required: ["parentIssueKey", "summary"]
  }
};

// Tool Handlers
export function createJiraIssue(args) {
  const { projectKey, summary, description, issueType } = args;
  return jiraService.createIssue(projectKey, summary, description, issueType);
}

export function getJiraIssue(args) {
  const { issueIdOrKey } = args;
  return jiraService.getIssue(issueIdOrKey);
}

export function updateJiraIssue(args) {
  const { issueIdOrKey, summary, description } = args;
  const updates = {};
  if (summary !== undefined) updates.summary = summary;
  if (description !== undefined) updates.description = description;
  return jiraService.updateIssue(issueIdOrKey, updates);
}

export function deleteJiraIssue(args) {
  const { issueIdOrKey } = args;
  return jiraService.deleteIssue(issueIdOrKey);
}

export function searchJiraIssues(args) {
  const { jql, maxResults = 50 } = args;
  return jiraService.searchIssues(jql, maxResults);
}

export function getJiraTransitions(args) {
  const { issueIdOrKey } = args;
  return jiraService.getTransitions(issueIdOrKey);
}

export function transitionJiraIssue(args) {
  const { issueIdOrKey, targetStatus } = args;
  return jiraService.transitionIssueByName(issueIdOrKey, targetStatus);
}

export function assignJiraIssue(args) {
  const { issueIdOrKey, accountId } = args;
  return jiraService.assignIssue(issueIdOrKey, accountId);
}

export function createJiraSubtask(args) {
  const { parentIssueKey, summary, description } = args;
  return jiraService.createSubtask(parentIssueKey, summary, description);
} 