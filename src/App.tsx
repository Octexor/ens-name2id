import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Textarea,
  Heading,
  Flex,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Alert,
  AlertIcon,
  Container, AlertDescription, AlertTitle, Select, Input,
} from "@chakra-ui/react"
import theme from "./theme";
import { ChevronDownIcon } from "@chakra-ui/icons"
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-solarized_dark";
import ReactJson from 'react-json-view'
import { extend, generate, normalize } from "./helpers/gen-map";
import { ExportTypes, Invalids, Name2IdMap } from "./helpers/types";
import { getList, ListItem, lists } from "./helpers/lists";
import { exportMap, exportTypes } from "./helpers/export-map";

const maxRendered = 500;
const mainListVals = Object.keys(lists);
const mainListItems: ListItem[] = mainListVals.map((val) => ({name: lists[val].name, val, closeOnSelect: false }));

export const App = () => {
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState({} as Name2IdMap);
  const [displayResult, setDisplayResult] = React.useState({} as Name2IdMap);
  const [invalidNames, setInvalidNames] = React.useState([] as Invalids);
  const [totalCount, setTotalCount] = React.useState(0);
  const [duplicates, setDuplicates] = React.useState(0);
  const [isId2Name, setIsId2Name] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const [loadingList, setLoadingList] = React.useState(false);
  const [listItems, setListItems] = React.useState<ListItem[]>(mainListItems);
  const [extension, setExtension] = React.useState("");
  const [extensionMode, setExtensionMode] = React.useState("prefix");
  const [extendLoading, setExtendLoading] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const displayCount = Object.keys(displayResult).length;

  const handleChange = (val: string) => {
    setInput(val);
  };

  const list = (listName: string) => {
    const isMainListItem = mainListVals.includes(listName);
    if(listName === 'back') {
      setListItems(mainListItems);
      return;
    }
    if(isMainListItem) {
      setListItems([{name: '❮ Back', val:'back', closeOnSelect: false} as ListItem].concat(lists[listName].subItems));
      return;
    }
    countEvent('list', listName);
    setTotalCount(0);
    setDuplicates(0);
    setDisplayResult({});
    setLoadingList(true);
    getList(listName).then((content: string) => {
      setInput(content);
      setLoadingList(false);
    });
  };

  const gen = React.useCallback(async (input: string, id2name?: boolean) => {
    countEvent('gen', id2name ? 'id2name' : '');
    setLoading(true);
    const { map, displayMap, invalids, count, duplicates } = await generate({ id2name, input, maxRendered });
    setDisplayResult(displayMap);
    setInvalidNames(invalids);
    setResult(map);
    setTotalCount(count);
    setDuplicates(duplicates);
    setIsId2Name(!!id2name);
    setLoading(false);
    return map;
  }, []);

  const normalizeHandler = React.useCallback(async (input: string) => {
    setLoading(true);
    const { normalInput, invalids, count, duplicates } = await normalize({ input });
    setInvalidNames(invalids);
    setTotalCount(count);
    setDuplicates(duplicates);
    setInput(normalInput);
    setLoading(false);
  }, []);

  const handleExport = (type: ExportTypes) => {
    countEvent('dl', type);
    setDownloading(true);
    exportMap({data: result, id2Name: isId2Name, type}).then(() => {
      setDownloading(false);
    });
  };

  const clear = () => {
    setInput("");
    setRefresh(true);
  }

  const removeInvalids = () => {
    gen(input).then(r => {
      setInput(Object.keys(r).sort().join(' '));
    });
  }

  const applyExtention = React.useCallback(async (input: string, extension: string, extensionMode: string) => {
    setExtendLoading(true);
    const { normalInput, count, duplicates } = await extend({ input, extension, extensionMode });
    setInput(normalInput);
    setExtendLoading(false);
  }, []);

  React.useEffect(() => {
    if (refresh) {
      gen(input);
      setRefresh(false);
    }
  }, [input, refresh, gen])

  return (
    <ChakraProvider theme={theme}>
      <Box display="flex" flexDirection="column" textAlign="center" fontSize="xl" minH="100vh" justifyContent="space-between">
        <Grid p={3}>
          <VStack spacing={2} maxW={{base: "sm", md: "md", xl: "xl"}} w="full" marginX="auto">
            <Heading size="lg">ENS Name to ID</Heading>
            <VStack spacing={1} w="full">
              <Text fontSize="md">
                List of ENS names separated by <Code>,</Code> <Code>space</Code> or <Code>new line</Code>
              </Text>
              <Box maxW={{base: "sm", md: "md", xl: "xl"}} w="full">
                <AceEditor theme="solarized_dark" mode="text" wrapEnabled={true} value={input} onChange={handleChange} width="100%" height="260px" setOptions={{wrapMethod: "text", indentedSoftWrap: false, showGutter: false, fontSize: 16, fontFamily: "monospace"}} enableBasicAutocompletion={false} enableLiveAutocompletion={false}/>
              </Box>
            </VStack>
            <Flex maxW="xs" direction="row" wrap="wrap" justifyContent="center" alignContent="space-between" alignItems="flex-end">
              <ButtonGroup isAttached isDisabled={input.length === 0} colorScheme="teal">
                <Button onClick={() => gen(input, false)} loadingText='Generating...' spinnerPlacement='end' isLoading={loading}>Generate Mapping</Button>
                <Menu colorScheme="teal">
                  <MenuButton as={Button} paddingInlineStart="0" paddingInlineEnd="2" minW="5" rightIcon={<ChevronDownIcon />} disabled={input.length === 0 || loading}></MenuButton>
                  <MenuList minW="7rem" fontSize="md" bg="teal.200" color="gray.800" _hover={{bg: "teal.300"}}>
                    <MenuItem onClick={() => gen(input, true)} fontWeight="semibold">ID to Name</MenuItem>
                    <MenuItem onClick={() => normalizeHandler(input)} fontWeight="semibold">Normalize</MenuItem>
                  </MenuList>
                </Menu>
              </ButtonGroup>
              <Menu>
                <MenuButton as={Button} loadingText='Listing...' spinnerPlacement='end' isLoading={loadingList} paddingInlineEnd="2" minW="5" style={{marginLeft: "0.5rem"}} rightIcon={<ChevronDownIcon />}>Lists</MenuButton>
                <MenuList minW="7rem" fontSize="md" style={{
                  display: "grid",
                  gridAutoFlow: "column",
                  gridTemplateRows: "repeat(10, auto)"
                }}>
                  {listItems.map(item => (
                    <MenuItem onClick={() => list(item.val)} key={item.val} closeOnSelect={item.closeOnSelect !== false}>{item.name}<span style={{paddingLeft: '10px', marginLeft: 'auto', display: item.closeOnSelect === false && item.val !== 'back' ? 'block' : 'none'}}>❯</span></MenuItem>
                  ))}
                </MenuList>
              </Menu>
              
              <Flex maxW="xs" direction="row" justifyContent="center" alignContent="space-between" alignItems="flex-end" padding={"0 1rem"} marginTop={"0.5rem"}>
                <Select onChange={val => setExtensionMode(val.target.value)} flex={"3 1"} isDisabled={input.length === 0}>
                  <option value='prefix'>Prefix</option>
                  <option value='suffix'>Suffix</option>
                </Select>
                <Input value={extension} onChange={(val) => setExtension(val.target.value)} style={{marginLeft: "0.5rem", flex: "2 1"}} isDisabled={input.length === 0}/>
                <Button onClick={() => applyExtention(input, extension, extensionMode)} style={{marginLeft: "0.5rem", flex: "2 1"}} isDisabled={input.length === 0 || extension.length === 0} isLoading={extendLoading}>Apply</Button>
              </Flex>

              <ButtonGroup isAttached isDisabled={input.length === 0}>
                <Button onClick={clear}>Clear</Button>
                <Menu>
                  <MenuButton as={Button} paddingInlineStart="0" paddingInlineEnd="2" minW="5" rightIcon={<ChevronDownIcon />}></MenuButton>
                  <MenuList minW="7rem" fontSize="md">
                    <MenuItem onClick={removeInvalids}>Remove Invalids</MenuItem>
                  </MenuList>
                </Menu>
              </ButtonGroup>
              <ButtonGroup isAttached isDisabled={totalCount === 0} style={{marginLeft: "0.5rem", marginTop: "0.5rem"}}>
                <Button onClick={() => handleExport('json')} loadingText='Downloading...' spinnerPlacement='end' isLoading={downloading}>Download JSON</Button>
                <Menu>
                  <MenuButton as={Button} paddingInlineStart="0" paddingInlineEnd="2" minW="5" rightIcon={<ChevronDownIcon />} disabled={totalCount === 0 || downloading}></MenuButton>
                  <MenuList minW="7rem" fontSize="md">
                    {exportTypes.map(item => (
                      <MenuItem value={item.val} onClick={() => handleExport(item.val as ExportTypes)} key={item.val}>{item.name}</MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </ButtonGroup>

            </Flex>

            {invalidNames.length > 0 && <Stack spacing={1} fontSize="md">
              {invalidNames.slice(0, 5).map(inv => (
                <Alert status='error' borderRadius="10" py="2" key={inv.name}>
                  <AlertIcon />
                  <VStack alignItems={"start"}>
                    <AlertTitle>Invalid name: "{inv.name}"</AlertTitle>
                    <AlertDescription>error: {inv.error.message}</AlertDescription>
                  </VStack>
                </Alert>
              ))}
              {invalidNames.length > 5 && <Alert status='error' borderRadius="10" py="2">
                <AlertIcon />
                <AlertDescription>{invalidNames.length - 5} more invalid name{invalidNames.length > 6 ? 's' : ''}!</AlertDescription>
              </Alert>
              }
            </Stack>
            }
            {totalCount > 0 && <VStack spacing={1} w="full">
              <Text fontSize="md">
                {duplicates ? `${duplicates} duplicate${duplicates > 1 ? 's' : ''}. ` : ''}{totalCount} valid names.{(displayCount > 0 && totalCount > maxRendered) ? ` First ${maxRendered} shown below:` : ''}
              </Text>
              {displayCount > 0 && <Box textAlign="left" fontSize="md" maxW={{base: "sm", md: "md", xl: "xl"}} maxH="xl" overflowY="auto" w="full">
                <ReactJson
                  src={displayResult}
                  theme="solarized"
                  name={false}
                  displayDataTypes={false}
                  collapseStringsAfterLength={30}
                  sortKeys={true}
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                    wordBreak: "break-all"
                  }}
                ></ReactJson>
              </Box>}
            </VStack>
            }
          </VStack>
        </Grid>
        <Box
          bg={'gray.900'}
          color={'gray.200'}>
          <Container
            as={Stack}
            maxW={'6xl'}
            py={4}
            direction='row'
            spacing={4}
            justify='center'
            align='center'>
            <Text fontSize="md">Built by <Link color="teal.500" href="https://twitter.com/Octexor" target="_blank">@Octexor</Link></Text>
          </Container>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

function countEvent(str1: string, str2?: string) {
  const url = 'https://nullitics.com/n.gif?u=https://ensname2id.10ktools.eth.limo';
  fetch(`${url}/${str1}`).catch(() => {});
  str2 && fetch(`${url}/${str1}/${str2}`).catch(() => {});
}