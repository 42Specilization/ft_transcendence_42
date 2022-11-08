/* eslint-disable quotes */
import { useState } from "react";
import { ChatCommunity } from "../../components/Chat/ChatCommunity/ChatCommunity";
import { ChatTalk } from "../../components/Chat/ChatTalk/ChatTalk";
import { IntraData } from "../../Interfaces/interfaces";
import "./Chat.scss";

export default function Chat() {
  const friends: Array<IntraData> = [
    {
      first_name: "string",
      email: "string",
      usual_full_name: "string",
      image_url:
        "https://www.ofuxico.com.br/wp-content/uploads/2022/09/everybody-still-hates-chris-768x512.jpg.webp",
      login: "carinha que mora logo ali",
      matches: "0",
      wins: "0",
      lose: "0",
      isTFAEnable: false,
      tfaValidated: false,
    },
    {
      first_name: "string",
      email: "string",
      usual_full_name: "string",
      image_url:
        "https://tudocommoda.com/wp-content/uploads/2022/01/pessoa-interessante.png",
      login: "2",
      matches: "0",
      wins: "0",
      lose: "0",
      isTFAEnable: false,
      tfaValidated: false,
    },
    {
      first_name: "string",
      email: "string",
      usual_full_name: "string",
      image_url:
        "https://www.arita.com.br/wp-content/uploads/2020/08/pessoa-expansiva-principais-caracteristicas-desta-personalidade.jpg",
      login: "3",
      matches: "0",
      wins: "0",
      lose: "0",
      isTFAEnable: false,
      tfaValidated: false,
    },
    {
      first_name: "string",
      email: "string",
      usual_full_name: "string",
      image_url:
        "https://tudocommoda.com/wp-content/uploads/2022/01/como-ser-uma-pessoa-interessante.png",
      login: "4",
      matches: "0",
      wins: "0",
      lose: "0",
      isTFAEnable: false,
      tfaValidated: false,
    },
    {
      first_name: "string",
      email: "string",
      usual_full_name: "string",
      image_url:
        "https://www.pessoaepessoa.com.br/wp-content/uploads/2020/09/Valton-Pessoa-868x1300.jpg",
      login: "5",
      matches: "5",
      wins: "0",
      lose: "0",
      isTFAEnable: false,
      tfaValidated: false,
    },
    {
      first_name: "string",
      email: "string",
      usual_full_name: "string",
      image_url:
        "https://img.freepik.com/fotos-gratis/retrato-de-uma-jovem-feliz-vestindo-camiseta-casual-mostrando-o-polegar-para-cima-isolado-sobre-fundo-rosa_1150-63328.jpg?w=996&t=st=1667742993~exp=1667743593~hmac=619ded42b975ab74f04a487c01cd47940838efc6db514bab4f32dab4d4c035a1",
      login: "6",
      matches: "6",
      wins: "0",
      lose: "0",
      isTFAEnable: false,
      tfaValidated: false,
    },
    {
      first_name: "string",
      email: "string",
      usual_full_name: "string",
      image_url:
        "https://imagens.brasil.elpais.com/resizer/4GvCWrQM6KpRzTXoh4IvOoFxSB8=/980x0/arc-anglerfish-eu-central-1-prod-prisa.s3.amazonaws.com/public/6TE7TL7D4YWZFV2TFRSGNGN6JE.jpg",
      login: "7",
      matches: "7",
      wins: "0",
      lose: "0",
      isTFAEnable: false,
      tfaValidated: false,
    },
    {
      first_name: "string",
      email: "string",
      usual_full_name: "string",
      image_url:
        "https://cdn.vnda.com.br/cobogo/2021/10/29/19_10_3_309_site_autor_PatrickPessoa.jpg?v=1638557521",
      login: "8",
      matches: "8",
      wins: "0",
      lose: "0",
      isTFAEnable: false,
      tfaValidated: false,
    },
    {
      first_name: "string",
      email: "string",
      usual_full_name: "string",
      image_url:
        "https://pcdmais.com.br/wp-content/uploads/2020/10/pcd-pne-afinal-qual-a-nomenclatura-correta-devo-utilizar.jpg",
      login: "9",
      matches: "9",
      wins: "0",
      lose: "0",
      isTFAEnable: false,
      tfaValidated: false,
    },
    {
      first_name: "string",
      email: "string",
      usual_full_name: "string",
      image_url:
        "https://conteudo.imguol.com.br/c/entretenimento/f6/2022/06/27/falar-sozinho-conversar-1656358211178_v2_450x450.jpg.webp",
      login: "10",
      matches: "10",
      wins: "0",
      lose: "0",
      isTFAEnable: false,
      tfaValidated: false,
    },
    {
      first_name: "string",
      email: "string",
      usual_full_name: "string",
      image_url:
        "https://psicoter.com.br/wp-content/uploads/2019/01/pessoa-flexivel-seja-mais-flexivel.jpg",
      login: "11",
      matches: "11",
      wins: "0",
      lose: "0",
      isTFAEnable: false,
      tfaValidated: false,
    },
  ];
  const [activeFriend, setActiveFriend] = useState<IntraData | null>(null);

  return (
    <div className="body">
      <div className="chat">
        <ChatCommunity friends={friends} setActiveFriend={setActiveFriend} />
        <ChatTalk activeFriend={activeFriend} />
      </div>
    </div>
  );
}
