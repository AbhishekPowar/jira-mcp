import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// JIRA configuration from environment variables
const JIRA_CONFIG = {
  baseUrl: process.env.JIRA_BASE_URL,
  apiToken: process.env.JIRA_API_TOKEN,
  email: process.env.JIRA_EMAIL
};

class JiraService {
  constructor(config = JIRA_CONFIG) {
    if (!config.baseUrl || !config.apiToken || !config.email) {
      throw new Error('Missing required JIRA configuration. Please check your .env file.');
    }
    this.baseUrl = config.baseUrl;
    this.auth = Buffer.from(`${config.email}:${config.apiToken}`).toString('base64');
  }

  async makeRequest(endpoint, method = 'GET', body = null) {
    const headers = {
      'Authorization': `Basic ${this.auth}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const options = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`JIRA API request failed: ${response.statusText}\n${errorData}`);
      }

      return method === 'DELETE' ? null : await response.json();
    } catch (error) {
      console.error('JIRA API Error:', error);
      throw error;
    }
  }

  async createIssue(projectKey, summary, description, issueType = 'Task') {
    const body = {
      fields: {
        project: { key: projectKey },
        summary: summary,
        description: description,
        issuetype: { name: issueType }
      }
    };

    return this.makeRequest('/rest/api/2/issue', 'POST', body);
  }

  async getIssue(issueIdOrKey) {
    return this.makeRequest(`/rest/api/2/issue/${issueIdOrKey}`);
  }

  async updateIssue(issueIdOrKey, updates) {
    return this.makeRequest(`/rest/api/2/issue/${issueIdOrKey}`, 'PUT', { fields: updates });
  }

  async deleteIssue(issueIdOrKey) {
    return this.makeRequest(`/rest/api/2/issue/${issueIdOrKey}`, 'DELETE');
  }

  async searchIssues(jql, maxResults = 50) {
    const body = {
      jql,
      maxResults,
      fields: ['summary', 'description', 'status', 'priority']
    };

    return this.makeRequest('/rest/api/2/search', 'POST', body);
  }

  // Get available transitions for an issue
  async getTransitions(issueIdOrKey) {
    const response = await this.makeRequest(`/rest/api/2/issue/${issueIdOrKey}/transitions`);
    return response.transitions;
  }

  // Transition an issue to a new status
  async transitionIssue(issueIdOrKey, transitionId) {
    const body = {
      transition: { id: transitionId }
    };
    return this.makeRequest(`/rest/api/2/issue/${issueIdOrKey}/transitions`, 'POST', body);
  }

  // Helper method to transition by status name
  async transitionIssueByName(issueIdOrKey, targetStatus) {
    const transitions = await this.getTransitions(issueIdOrKey);
    const transition = transitions.find(t => t.name.toLowerCase() === targetStatus.toLowerCase());
    
    if (!transition) {
      throw new Error(`No transition found to status "${targetStatus}". Available transitions: ${transitions.map(t => t.name).join(', ')}`);
    }

    return this.transitionIssue(issueIdOrKey, transition.id);
  }

  // Add method for assigning issues
  async assignIssue(issueIdOrKey, accountId) {
    const body = {
      accountId: accountId
    };
    return this.makeRequest(`/rest/api/2/issue/${issueIdOrKey}/assignee`, 'PUT', body);
  }

  // Add method for creating subtasks
  async createSubtask(parentIssueKey, summary, description) {
    const body = {
      fields: {
        project: { key: parentIssueKey.split('-')[0] },
        summary: summary,
        description: description,
        issuetype: { name: 'Sub-task' },
        parent: { key: parentIssueKey }
      }
    };
    return this.makeRequest('/rest/api/2/issue', 'POST', body);
  }
}

// Export a singleton instance
export const jiraService = new JiraService(); 