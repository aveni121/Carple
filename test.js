fetch(
  "https://api.airtable.com/v0/appnvxGwUmI16KQPz/Groups?api_key=keyUbkyh9tjdFBa9O"
)
  .then((response) => response.json())
  .then((data) => console.log(data));
