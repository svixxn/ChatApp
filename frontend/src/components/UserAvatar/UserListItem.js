import React from 'react';
import {ChatContext} from "../../context/ChatProvider";
import {Avatar, Box, Text} from "@chakra-ui/react";

function UserListItem({user, handleFunction}) {

    return (
        <Box
        onClick={handleFunction}
        cursor={"pointer"}
        borderRadius={"10px"}
        bg={"#E8E8E8"}
        _hover={{
            background:"#38B2AC",
            color:"white"
        }}
        w={"100%"}
        display={"flex"}
        alignItems={"center"}
        color={"black"}
        px={3}
        py={2}
        mt={2}
        >
            <Avatar
            mr={2}
            size={"sm"}
            cursor={"pointer"}
            name={user.name}
            src={user.pic}
            />

            <Box
            >
                <Text>{user.name}</Text>
                <Text fontSize={"xs"}>
                    <b>Email: </b>
                    {user.email}
                </Text>
            </Box>

        </Box>
    );
}

export default UserListItem;