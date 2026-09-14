import re

content = """import GigDetail, { generateMetadata as _generateMetadata } from "../page";

export const generateMetadata = async (props) => {
  return await _generateMetadata(props);
};

export default async function Page(props) {
  return <GigDetail {...props} />;
}
"""
with open("src/app/gig/[id]/[slug]/page.js", "w") as f:
    f.write(content)
