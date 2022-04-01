import styled from 'styled-components'

export const WalletConnectContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;

  background: rgba(0,0,0,0.6);
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;

  color: black;

  .wallet-frame {
    display: flex;
    flex-direction: column;

    .top-radius {
      border-radius: 20px 20px 0 0;
    }

    .bottom-radius {
      border-radius: 0 0 20px 20px;
    }

    .one-wallet {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      padding: 40px;

      background: #eee;

      &:hover {
        background: #e8e8e8;
      }

      &:active {
        background: #d8d8d8;
      }

      .wallet-caption {
        margin-bottom: 14px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        img {
          margin-right: 20px;
        }

        .wallet-label {
          font-family: Roboto;
          font-size: 28px;
        }
      }

      .wallet-description {
        font-family: 'Roboto';
        font-size: 16px;
        text-align: center;
      }
    }
  }
`;
