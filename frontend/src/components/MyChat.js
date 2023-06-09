import React, {useContext, useEffect, useState} from 'react';
import {ChatState} from "../context/ChatProvider";
import {Avatar, Box, Button, Stack, Text, useToast} from "@chakra-ui/react";
import axios from "axios";
import {AddIcon} from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import {getSender, getSenderPhoto} from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

function MyChat({fetchAgain}) {
    const {user, chats, selectedChat, setSelectedChat, setChats} = ChatState();
    const [loggedUser, setLoggedUser] = useState()

    const toast = useToast()

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.get("/api/chat", config)
            setChats(data)
        } catch (err) {
            toast({
                title: "Failed to load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
        fetchChats()
    }, [fetchAgain])

    return <Box
        display={{base: selectedChat ? "none" : "flex", md: "flex"}}
        flexDir={"column"}
        p={3}
        alignItems={"center"}
        w={{base: "100%", md: "31%"}}
        borderRadius={"lg"}
        borderWidth={"1px"}
        className={"dark-theme"}
    >
        <Box
            pb={3}
            px={3}
            fontSize={{base: "28px", md: "30px"}}
            fontFamily={"Work Sans"}
            display={"flex"}
            w={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
        >
            My Chats

            <GroupChatModal>
                <Button
                    display={"flex"}
                    fontSize={{base: "17px", md: "10px", lg: "17px"}}
                    rightIcon={<AddIcon/>}
                    bg={"#2e9f93"}
                >
                    New Group Chat
                </Button>
            </GroupChatModal>
        </Box>
        <Box
            display={"flex"}
            flexDir={"column"}
            p={3}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
            className="dark-theme"
        >
            {chats ? (
                <Stack overflowY={"scroll"}>
                    {chats.map((chat) => (
                        <Box
                            onClick={() => setSelectedChat(chat)}
                            bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                            cursor={"pointer"}
                            display={"flex"}
                            alignItems={"center"}
                            height={"7vh"}
                            color={selectedChat === chat ? "white" : "black"}
                            px={3}
                            py={2}
                            borderRadius={"lg"}
                            key={chat._id}
                        >
                            {/*{(!chat.isGroupChat && chat.users) &&
                                (<Avatar
                                    mr={2}
                                    size={"sm"}
                                    cursor={"pointer"}
                                    name={user.name}
                                    src={getSenderPhoto(loggedUser, chat.users)}
                                />)
                            }*/}

                            <Box>
                                <Text>
                                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : (chat.chatName)}
                                </Text>
                                <Text fontSize={"xs"}>
                                    test
                                </Text>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            ) : (
                <ChatLoading/>
            )}
        </Box>
    </Box>
}

export default MyChat;