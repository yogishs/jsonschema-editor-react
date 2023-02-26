import * as React from "react";
import Form from '@arco-design/web-react/lib/Form';
import InputNumber from '@arco-design/web-react/lib/InputNumber';
import Checkbox from '@arco-design/web-react/lib/Checkbox';
import TextArea from '@arco-design/web-react/lib/Input/textarea';

import {
	AdvancedItemStateProps,
	JSONSchema7,
} from "../../JsonSchemaEditor.types";
import {none, useState} from "@hookstate/core";
import {Space} from "@arco-design/web-react";

export const AdvancedNumber: React.FunctionComponent<AdvancedItemStateProps> = (
	props: React.PropsWithChildren<AdvancedItemStateProps>
) => {
	const {itemStateProp} = props;

	const changeEnumOtherValue = (value: string): string[] | null => {
		const array = value.split("\n");
		if (array.length === 0 || (array.length === 1 && !array[0])) {
			return null;
		}

		return array;
	};

	const itemState = useState(itemStateProp);

	const isEnumChecked = (itemState.value as JSONSchema7).enum !== undefined;
	const enumData = (itemState.value as JSONSchema7).enum
		? (itemState.enum.value as string[])
		: [];
	const enumValue = enumData?.join("\n");

	return (
		<div className="arco-form arco-form-vertical">
			<Form.Item layout="vertical" label="Default" colon={true}>
				<InputNumber
					defaultValue={Number(itemState.default.value)}
					placeholder="Default value"
					onChange={(value: number | string) => {
						itemState.default.set(Number(value));
					}}
					value={Number(itemState.default.value)}
				/>
			</Form.Item>

			<div className="arco-form arco-form-inline">
				<Space size="small">
					<Form.Item layout="vertical" label="Min Value" colon={true}>
						<InputNumber
							defaultValue={Number(itemState.minimum.value)}
							onChange={(value: number | string) => {
								itemState.minimum.set(Number(value));
							}}
							value={Number(itemState.minimum.value)}
						/>
					</Form.Item>
					<Form.Item layout="vertical" label="Max Value" colon={true}>
						<InputNumber
							defaultValue={Number(itemState.maximum.value)}
							onChange={(value: number | string) => {
								itemState.maximum.set(Number(value));
							}}
							value={Number(itemState.maximum.value)}/>
					</Form.Item>
				</Space>
			</div>
			<div className="arco-form arco-form-inline">
				<Space size="small">
					<Form.Item layout="vertical" label="Enum" colon={true}>
						<Checkbox
							checked={isEnumChecked}
							onChange={(value) => {
								if (!value) {
									itemState.enum.set(none);
								} else {
									itemState.enum.set(Array<string>());
								}
							}}
						/>
					</Form.Item>
					<Form.Item layout="vertical">
						<TextArea
							value={enumValue}
							disabled={!isEnumChecked}
							placeholder="ENUM Values - One Entry Per Line"
							onChange={(value) => {
								const re = /^[0-9\n]+$/;
								if (value === "" || re.test(value)) {
									const update = changeEnumOtherValue(value);
									if (update === null) {
										itemState.enum.set(none);
									} else {
										itemState.enum.set(update as string[]);
									}
								}
							}}
						/>
					</Form.Item>
				</Space>
			</div>
		</div>
	);
};
