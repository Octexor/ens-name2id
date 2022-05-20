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
  HStack,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Alert,
  AlertIcon,
  Container,
} from "@chakra-ui/react"
import theme from "./theme";
import { ChevronDownIcon } from "@chakra-ui/icons"
import ReactJson from 'react-json-view'
import exportFromJSON from 'export-from-json'
import writeXlsxFile from 'write-excel-file'
import generate from "./helpers/gen-map";

interface Name2IdMap {
  [index: string]: string;
}
type ExportTypes = keyof typeof exportFromJSON.types;
type Invalids = {name: string, error: Error}[];
const xlsSchema = [
  {
    column: 'Name',
    type: String,
    value: (obj: Name2IdMap) => obj.name
  },
  {
    column: 'Token ID',
    type: String,
    value: (obj: Name2IdMap) => obj.tokenId
  }
];

export const App = () => {
  let [input, setInput] = React.useState('');
  let [result, setResult] = React.useState({} as Name2IdMap);
  let [displayResult, setDisplayResult] = React.useState({} as Name2IdMap);
  let [invalidNames, setInvalidNames] = React.useState([] as Invalids);
  let [totalCount, setTotalCount] = React.useState(0);
  let [isId2Name, setIsId2Name] = React.useState(false);
  let [refresh, setRefresh] = React.useState(false);
  const exportTypes = [{ name: 'CSV', val: 'csv' }, { name: 'XLS', val: 'xls' }];
  const lists = [
    { name: '999 Club', val: '999' },
    { name: '10k Club', val: '10k' },
    { name: '100k Club', val: '100k' }
  ];
  const maxRendered = 500;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  const handleExport = (type: ExportTypes) => {
    let keys;
    if (isId2Name) {
      keys = Object.keys(result).sort((a, b) => (result[a].localeCompare(result[b])));
    } else {
      keys = Object.keys(result).sort();
    }
    if (type === "json") {
      exportFromJSON({
        data: result,
        fileName: `ens-name-tokenIds-${Date.now()}`,
        exportType: exportFromJSON.types[type],
        replacer: keys
      });
    } else {
      const dataArray: { name: string, tokenId: string }[] = [];
      if (isId2Name) {
        keys.forEach(id => {
          dataArray.push({ tokenId: id, name: result[id] });
        });
      } else {
        keys.forEach(name => {
          dataArray.push({ name, tokenId: result[name] });
        });
      }
      if (type === 'xls') {
        writeXlsxFile(dataArray, {
          schema: isId2Name ? xlsSchema.reverse() : xlsSchema,
          fileName: `ens-name-tokenIds-${Date.now()}.xlsx`
        }).catch(console.error);
      } else {
        exportFromJSON({
          data: dataArray,
          fileName: `ens-name-tokenIds-${Date.now()}`,
          exportType: exportFromJSON.types[type]
        });
      }
    }
  };

  const list = (listName: string) => {
    let content = '';
    switch (listName) {
      case '999':
        for (let i = 0; i < 1000; i++) {
          content += (i + '').padStart(3, '0') + ' ';
        }
        break;
      case '10k':
        for (let i = 0; i < 10000; i++) {
          content += (i + '').padStart(4, '0') + ' ';
        }
        break;
      case '100k':
        for (let i = 0; i < 100000; i++) {
          content += (i + '').padStart(5, '0') + ' ';
        }
        break;
    }
    setInput(content);
  };

  const gen = React.useCallback((input: string, id2name?: boolean) => {
    const {map, displayMap, invalids, count} = generate({id2name, input, maxRendered});
    setDisplayResult(displayMap)
    setInvalidNames(invalids);
    setResult(map);
    setTotalCount(count);
    setIsId2Name(!!id2name);
    return map;
  }, []);

  const clear = () => {
    setInput("");
    setRefresh(true);
  }

  const removeInvalids = () => {
    const r = gen(input);
    setInput(Object.keys(r).join(' '));
  }

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
          <VStack spacing={2} maxW="xl" w="full" marginX="auto">
            <Heading size="lg">ENS Name to ID</Heading>
            <VStack spacing={1} w="full">
              <Text fontSize="md">
                List of ENS names separated by <Code>,</Code> <Code>space</Code> or <Code>new line</Code>
              </Text>
              <Textarea id="input" h="40" maxW="xl" w="full" fontFamily="monospace" value={input} onChange={handleChange}></Textarea>
            </VStack>
            <HStack>
              <ButtonGroup isAttached isDisabled={input.length === 0} colorScheme="teal">
                <Button onClick={() => gen(input, false)}>Generate Mapping</Button>
                <Menu colorScheme="teal">
                  <MenuButton as={Button} paddingInlineStart="0" paddingInlineEnd="2" minW="5" rightIcon={<ChevronDownIcon />}></MenuButton>
                  <MenuList minW="7rem" fontSize="md" bg="teal.200" color="gray.800" _hover={{bg: "teal.300"}}>
                    <MenuItem onClick={() => gen(input, true)} fontWeight="semibold">ID to Name</MenuItem>
                  </MenuList>
                </Menu>
              </ButtonGroup>
              <Menu>
                <MenuButton as={Button} paddingInlineEnd="2" minW="5" rightIcon={<ChevronDownIcon />}>Lists</MenuButton>
                <MenuList minW="7rem" fontSize="md">
                  {lists.map(item => (
                    <MenuItem onClick={() => list(item.val)} key={item.val}>{item.name}</MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <ButtonGroup isAttached isDisabled={input.length === 0}>
                <Button onClick={clear}>Clear</Button>
                <Menu>
                  <MenuButton as={Button} paddingInlineStart="0" paddingInlineEnd="2" minW="5" rightIcon={<ChevronDownIcon />}></MenuButton>
                  <MenuList minW="7rem" fontSize="md">
                    <MenuItem onClick={removeInvalids}>Remove Invalids</MenuItem>
                  </MenuList>
                </Menu>
              </ButtonGroup>
              <ButtonGroup isAttached isDisabled={totalCount === 0}>
                <Button onClick={() => handleExport('json')} >Download JSON</Button>
                <Menu>
                  <MenuButton as={Button} paddingInlineStart="0" paddingInlineEnd="2" minW="5" rightIcon={<ChevronDownIcon />}></MenuButton>
                  <MenuList minW="7rem" fontSize="md">
                    {exportTypes.map(item => (
                      <MenuItem value={item.val} onClick={() => handleExport(item.val as ExportTypes)} key={item.val}>{item.name}</MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </ButtonGroup>

            </HStack>
            {invalidNames.length > 0 && <Stack spacing={1} fontSize="md">
              {invalidNames.slice(0, 5).map(inv => (
                <Alert status='error' borderRadius="10" py="2" key={inv.name}>
                  <AlertIcon />
                  Invalid name: "{inv.name}" error: {inv.error.message} 
                </Alert>
              ))}
              {invalidNames.length > 5 && <Alert status='error' borderRadius="10" py="2">
                <AlertIcon />
                {invalidNames.length - 5} more invalid name{invalidNames.length > 6 ? 's' : ''}!
              </Alert>
              }
            </Stack>
            }
            {totalCount > 0 && <VStack spacing={1} w="full">
              {totalCount > maxRendered && <Text fontSize="md">
                {totalCount} valid names. First {maxRendered} shown below:
              </Text>
              }
              <Box textAlign="left" fontSize="md" maxW="xl" maxH="xl" overflowY="auto" w="full">
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
              </Box>
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
