import { useRouter } from "next/router";
import { Web3Provider } from "../context/Web3";

import Layout from "../components/Layout";
import Access from "../components/Access";

const CommunityContent = () => {
  return <div>Welcome to the private community.</div>;
};

const Community = () => {
  return (
    <Web3Provider>
      <Layout>
        <Access slug="community">
          <CommunityContent />
        </Access>
      </Layout>
    </Web3Provider>
  );
};

export default Community;
