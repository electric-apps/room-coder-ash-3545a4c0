#!/bin/bash
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "https://electric-agent.fly.dev/api/sessions/3545a4c0-48dd-4ce6-863a-0ec9aad25a96/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fa028bdb3c7b26abfbbe96d2f1a009e84801c2dada72158b1cbccc82ce681b1d" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0