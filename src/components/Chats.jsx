import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';
import Saved from '../img/saved.jpeg';

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: 'CHANGE_USER', payload: u });
  };

  const handleCreateChat = async () => {
    const chatId = `${currentUser.uid}-${currentUser.uid}`;

    await setDoc(doc(db, 'chats', chatId), {
      messages: [],
      users: [currentUser.uid],
    });

    await setDoc(doc(db, 'userChats', currentUser.uid, 'chats', chatId), {
      userInfo: {
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid,
      },
      lastMessage: null,
    });

    setChats((prevChats) => {
      const updatedChats = { ...prevChats };
      updatedChats[chatId] = {
        userInfo: {
          displayName: 'Saved',
          photoURL: currentUser.photoURL,
          uid: currentUser.uid,
        },
        lastMessage: null,
      };
      return updatedChats;
    });
  };
  useEffect(() => {
    handleCreateChat();
  }, [currentUser.uid]);

  return (
    <div className="chats">
      <div className="userChat">
        <img src={Saved} alt="" />
        <div className="userChatInfo">
          <span onClick={() => handleCreateChat}>Saved</span>
          <p></p>
        </div>
      </div>
      {Object.entries(chats).length > 0 &&
        Object.entries(chats)
          .sort((a, b) => b[1].date - a[1].date)
          .map((chat) => {
            const userInfo = chat[1]?.userInfo || {}; // Перевірка на наявність userInfo
            return (
              <div className="userChat" key={chat[0]} onClick={() => handleSelect(userInfo)}>
                <img src={userInfo.photoURL || ''} alt="" /> {/* Перевірка на наявність photoURL */}
                <div className="userChatInfo">
                  <span>{userInfo.displayName}</span>
                  <p>{chat[1].lastMessage?.text}</p>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default Chats;
