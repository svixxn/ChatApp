import React, {useState, useContext} from 'react';
import {
    Avatar,
    Box,
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton, Input, useToast, Spinner,
} from "@chakra-ui/react";
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import {ChatState} from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import {useHistory} from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import {getSender} from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import {Effect} from "react-notification-badge";
function SideDrawer() {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const {isOpen, onOpen, onClose} = useDisclosure()

    const { user, chats, setSelectedChat, setChats, notification, setNotification } = ChatState();
    const history = useHistory()
    const toast = useToast()

    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        history.push('/')
    }

    const handleSearch = async () => {
        if(!search){
            toast({
                title: "Please enter something in the search",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            })
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.get(`/api/user?search=${search}`, config)
            console.log(data)
            setLoading(false)
            setSearchResult(data)
        } catch(error){
            toast({
                title: "Error Occurred!",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    const accessChat = async (userId) => {
        try{
            setLoadingChat(true)

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.post("/api/chat", {userId}, config)

            if(!chats.find((c)=> c._id===data._id)) setChats([data, ...chats])
            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (err) {
            toast({
                title: "Error fetching the chat!",
                description: err.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    return <>
        <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            w={"100%"}
            p={"5px 10px 5px 10px"}
            borderWidth={"5px"}
            borderColor={"#343333"}
            className={"dark-theme"}
        >
            <Tooltip label={"Search Users to chat"} hasArrow placement={"bottom-end"}>
                <Button variant={"ghost"} onClick={onOpen} _hover={{bg:"#2e9f93"}}>
                    <i className="fa-solid fa-magnifying-glass"/>
                    <Text display={{base: "none", md: "flex"}} px={'4'}>
                        Search user
                    </Text>
                </Button>
            </Tooltip>

            <Text fontSize={"2xl"} fontFamily={"Work Sans"}>
                Chat App
            </Text>

            <div>
                <Menu>
                    <MenuButton p={"1"}>
                        <NotificationBadge
                            count={notification.length}
                            effect={Effect.SCALE}
                        />
                        <BellIcon fontSize="2xl" m={1} />
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notification.length && "No New Messages"}
                        {notification.map((notif) => (
                            <MenuItem
                                key={notif._id}
                                onClick={() => {
                                    setSelectedChat(notif.chat);
                                    setNotification(notification.filter((n) => n !== notif));
                                }}
                            >
                                {notif.chat.isGroupChat
                                    ? `New Message in ${notif.chat.chatName}`
                                    : `New Message from ${getSender(user, notif.chat.users)}`}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} bg={"#2e9f93"}>
                        <Avatar size={"sm"} cursor={'pointer'} name={user.name} src={user.pic}/>
                    </MenuButton>
                    <MenuList bg={"#343333"}>
                        <ProfileModal user={user}>
                        <MenuItem bg={"#343333"}>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider />
                        <MenuItem bg={"#343333"} onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>

        <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay>
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={"1px"} className={"dark-theme"}>Search Users</DrawerHeader>
                    <DrawerBody className={"dark-theme"}>
                        <Box display={"flex"} pb={"pb2"}>
                            <Input placeholder={"Search by name or email"} mr={2} value={search} onChange={(e)=>setSearch(e.target.value)} />
                            <Button onClick={handleSearch} bg={"#2e9f93"} _hover={{bg:"#2e9f93"}}>Go</Button>
                        </Box>
                        {loading? (
                            <ChatLoading />
                        ):(
                           searchResult?.map((user) => (
                               <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)}/>
                           ))
                        )}
                        {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    </>

}

export default SideDrawer;