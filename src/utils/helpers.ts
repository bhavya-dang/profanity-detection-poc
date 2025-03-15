function cleanResponse(response: string) {
  response = response
    .replace(/```json/g, "")
    .replace(/```/g, "") // Remove ```json
    .replace(/\\/g, "") // Remove backslashes
    .replace(/\n/g, ""); // Remove newlines

  return JSON.parse(response);
}

export { cleanResponse };
