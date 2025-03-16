import JiraService, { createJiraIssue, getJiraIssue, searchJiraIssues } from './jira.js';

async function testJiraFunctions() {
  try {
    // Test creating an issue in PROD project
    console.log('Creating a test issue in PROD project...');
    const createResult = await createJiraIssue({
      projectKey: 'PROD',
      summary: 'MCP Integration Test Issue',
      description: 'Testing JIRA integration with PROD project via MCP service',
      issueType: 'Task'
    });
    console.log('Create Result:', createResult);

    // Test getting the created issue
    if (createResult && createResult.key) {
      console.log('\nFetching the created issue...');
      const getResult = await getJiraIssue({
        issueIdOrKey: createResult.key
      });
      console.log('Get Result:', getResult);

      // Test searching for issues
      console.log('\nSearching for issues in PROD project...');
      const searchResult = await searchJiraIssues({
        jql: 'project = PROD ORDER BY created DESC',
        maxResults: 5
      });
      console.log('Search Result:', searchResult);
    }

  } catch (error) {
    console.error('Error testing JIRA functions:', error.message);
    // Log the full error for debugging
    console.error('Full error:', error);
  }
}

// Run the tests
testJiraFunctions(); 