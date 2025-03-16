# MCP Integration Guide

## Quick Setup

1. Create `.env` file:

```
JIRA_BASE_URL=your_jira_instance_url
JIRA_EMAIL=your_jira_email
JIRA_API_TOKEN=your_jira_api_token
```

2. Project Keys:

- Test: "TEST"
- Production: "PROD"

## File Structure

```
/src
├── server.js     # Server setup
├── jira/         # JIRA integration
└── hello/        # Example handlers
```

## Development Rules

1. **Tools**
   - Define in `tools.js`
   - Test with "TEST" project first
   - Use clear descriptions

2. **Security**
   - No credentials in code
   - Use environment variables
   - Follow JIRA security practices

3. **Code Style**
   - Keep modular
   - Document tools
   - Handle errors properly

## JIRA Workflow Guidelines

1. **Ticket Structure**
   - What: Clear problem statement
   - Why: Business value/impact
   - How: Implementation approach
   - Blockers: Dependencies/issues

2. **Task Breakdown**
   - Create max 3 subtasks
   - Keep subtasks focused and achievable
   - Use consistent naming

3. **Development Flow**

   ```
   1. Get ticket (ID/search)
   2. Update ticket structure (What/Why/How)
   3. Create subtasks (max 3)
   4. Assign to self
   5. Move main ticket to "In Dev"
   6. For each subtask:
      - Move to "In Dev"
      - Complete work
      - Move to "Done"
   6.5 : Update main ticket on how to test
   7. Move main ticket to "Done"
   8. Regularly update JIRA
   ```

## Best Practices

   1. Status Updates:
      - Update status before starting work
      - Keep status current
      - Document blockers immediately
