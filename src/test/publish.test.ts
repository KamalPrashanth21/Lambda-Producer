import { publishToWebHook } from "../publish";
import axios from "axios";
import { TargetOrderModel } from "../types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;