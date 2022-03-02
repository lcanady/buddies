import { ethers } from "ethers";
import { useEffect, useState } from "react";
import styled from "styled-components";
import contract from "../build/contracts/BuddieThePlatypus.json";
import buddie from "../assets/buddie.png";
import ReactLoading from "react-loading";

const contractAddress = "0xc51630A770bEf9D47db95DC2eE14b540D5A01376";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  background-color: ${({ disabled }) => (disabled ? "#7A4A58" : " #522230")};
  height: 72px;
  width: ${({ width }) => (width ? width : "320px")};
  outline: none;
  border: none;
  border-radius: 50px;
  margin-top: 36px;
`;

const CButton = styled.button`
  height: 72px;
  width: 72px;
  outline: none;
  border: none;
  border-radius: 50px;
  font-size: 48px;
  background-color: #fcb040;
  color: #000;
`;

const Input = styled.input`
  width: 100px;
  margin: 0 36px;
  border-radius: 50px;
  border-style: none;
  height: 72px;
  outline: none;
  color: black;
  text-align: center;
`;

const Banner = styled.div`
  width: 100%;
  height: 72px;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  background-color: #f1592a;
  position: fixed;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
`;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [cost, setCost] = useState("15");
  const [total, setTotal] = useState("0");
  const [mintNum, setMintnum] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState();
  const [err, setErr] = useState();
  const [chain, setChain] = useState();

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      try {
        setLoading(true);
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        setCurrentAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const { chainId } = await provider.detectNetwork();

        setChain(chainId);
        const nftContract = new ethers.Contract(
          contractAddress,
          contract.abi,
          signer
        );

        let num = await nftContract.getTotal();
        let price = await nftContract.getPrice();
        setCost(ethers.utils.formatEther(price));
        setTotal(num.toString());
        setLoading(false);
      } catch (error) {
        setErr(error);
      }
    }
  };

  const mintNFTHandler = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(
        contractAddress,
        contract.abi,
        signer
      );

      let nftTxn = await nftContract.publicMint(1, {
        value: ethers.utils.parseEther(cost),
      });
      setHash(null);
      setLoading(true);
      console.log("Mining... Please wait.");
      await nftTxn.wait();
      console.log("Mined!", nftTxn.hash);
      let newTotal = await nftContract.getTotal();
      setTotal(newTotal.toString());
      setMintnum(0);
      setHash(nftTxn.hash);
      setLoading(false);
    } catch (error) {
      setErr(error);
    }
  };

  useEffect(() => {
    setErr(null);
  }, [mintNum]);

  return (
    <Wrapper>
      <Banner visible={chain != 137}>Polygon network needed!</Banner>
      <img src={buddie} />
      <h1 style={{ fontSize: "48px" }}>Buddie The Giraffe</h1>
      {currentAccount && (
        <h2 style={{ fontSize: "48px" }}>
          {total}/999 @ {cost} matic
        </h2>
      )}
      {loading ? (
        <div style={{ marginTop: "36px" }}>
          <ReactLoading type="spin"></ReactLoading>
        </div>
      ) : (
        <Button
          onClick={currentAccount ? mintNFTHandler : connectWalletHandler}
          disabled={currentAccount && chain !== 137}
        >
          {currentAccount ? "Mint!" : "Connect Wallet"}
        </Button>
      )}
      {hash && (
        <a
          target="_blank"
          href={`https://polygonscan.com/tx/${hash}`}
          style={{ marginTop: "36px", textDecoration: "none" }}
        >
          "Transaction Successful!"
        </a>
      )}
      {err && (
        <p
          style={{
            width: "50%",
            textAlign: "center",
            marginTop: "36px",
            color: "#a50202",
          }}
        >
          {err.data && err.data.message ? err.data.message : err.message}
        </p>
      )}
    </Wrapper>
  );
}

export default App;
