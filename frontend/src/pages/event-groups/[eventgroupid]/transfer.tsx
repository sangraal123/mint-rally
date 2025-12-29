import { NextPage } from "next";
import { useRouter } from "next/router";
import EventGroupBase from "src/components/organisms/EventGroupBase";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { useLocale } from "src/hooks/useLocale";

const TransferPage: NextPage = () => {
    const { t } = useLocale();
    const router = useRouter();
    const { eventgroupid } = router.query;

    return (
        <EventGroupBase>
            <VStack spacing={5} align="stretch" mt={5}>
                <Heading size="md">{t.EVENT_GROUP_TAB_TRANSFER}</Heading>
                <Text>Coming Soon...</Text>
            </VStack>
        </EventGroupBase>
    );
};

export default TransferPage;
