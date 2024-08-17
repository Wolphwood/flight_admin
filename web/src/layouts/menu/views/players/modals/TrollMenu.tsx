import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { Stack, Group, Button, Select, NumberInput, TextInput, Divider, Accordion } from '@mantine/core'
import { fetchNui } from '../../../../../utils/fetchNui'
import { useLocales } from '../../../../../providers/LocaleProvider'
const TrollMenu = (props: {id: any}) => {
  const { locale } = useLocales();

  type TrollArgument =
  | { type: 'separator', invisible?: boolean }
  | { type: 'number'; value: string; label: string; default?: number; }
  | { type: 'text'; value: string; label: string; default?: string; }
  | {
      type: 'select';
      value: string;
      label: string;
      options: { value: string; label: string; selected?: boolean }[];
    };
  
  type TrollAction = {
    value: string;
    label: string;
    arguments: TrollArgument[];
  };

  const actions: TrollAction[] = [
    {
      value: 'ragdoll',
      label: locale.ui_troll_action_ragdoll,
      arguments: [
        { type: 'number', value: 'duration', label: locale.ui_troll_arg_duration_s, default: 10 },
      ],
    },
    {
      value: 'drunk',
      label: locale.ui_troll_action_drunk,
      arguments: [
        { type: 'number', value: 'duration', label: locale.ui_troll_arg_duration_s, default: 10 },
        { type: 'number', value: 'amplifier', label: locale.ui_troll_arg_amplifier, default: 3 },
        {
          type: 'select',
          value: 'animation',
          label: locale.ui_troll_arg_animation,
          options: [
            { value: 'move_m@drunk@a', label: locale.ui_troll_arg_animation_anm_a, selected: true },
            { value: 'move_m@drunk@b', label: locale.ui_troll_arg_animation_anm_b },
            { value: 'move_m@drunk@c', label: locale.ui_troll_arg_animation_anm_c },
            { value: 'move_m@drunk@slightlydrunk', label: locale.ui_troll_arg_animation_anm_slightlydrunk },
            { value: 'move_m@drunk@moderatedrunk', label: locale.ui_troll_arg_animation_anm_moderatedrunk },
            { value: 'move_m@drunk@verydrunk', label: locale.ui_troll_arg_animation_anm_verydrunk },
          ],
        },
      ],
    },
    {
      value: 'teleport',
      label: locale.ui_troll_action_teleport,
      arguments: [
        { type: 'text', value: 'pos', label: locale.ui_troll_arg_position, default: '~;~;~' },
        { type: 'text', value: 'rot', label: locale.ui_troll_arg_rotation, default: '~;~;~' },
      ],
    },
    // Ajoutez plus d'actions ici si nécessaire
  ];

  const [trollStates, setTrollStates] = useState(() =>
    actions.filter(a => a).reduce((acc: Record<string, Record<string, string | number>>, action) => {
      acc[action.value] = action.arguments.reduce((argAcc: Record<string, string | number>, arg) => {
        if (arg.type === 'select' && arg.options) {
          // Pour les arguments de type select, nous définissons une valeur par défaut vide
          argAcc[arg.value] = arg.options.find(option => option.selected)?.value || '';
        } else if (arg.type === 'number' || arg.type === 'text') {
          // Pour les arguments de type number ou text, nous définissons la valeur par défaut si elle est disponible
          argAcc[arg.value] = arg.default ?? (arg.type === 'number' ? 0 : '');
        }
        return argAcc;
      }, {} as Record<string, string | number>);
      return acc;
    }, {} as Record<string, Record<string, string | number>>)
  );

  const handleChange = (actionValue: any, argValue: any, newValue: any) => {
    setTrollStates((prev: any) => ({
      ...prev,
      [actionValue]: {
        ...prev[actionValue],
        [argValue]: newValue,
      },
    }));
  };

  const handleConfirm = (actionValue: any) => {
    const actionArgs = trollStates[actionValue];
    closeAllModals();
    fetchNui('flight_admin:trollPlayer', {
      id: props.id,
      value: actionValue,
      ...actionArgs,
    });
  };

  return (
    <Stack spacing="md">
      {actions.map((action) => (
        <Accordion>
          <Accordion.Item key={action.value} value={action.value}>
            <Accordion.Control>{action.label}</Accordion.Control>
            <Accordion.Panel style={{backgroundColor: 'transparent', borderColor: 'black'}}>
              <Stack spacing="sm">
                {action.arguments.map((argument: any, index) => {
                  switch (argument.type) {
                    case 'separator':
                      return (
                        (argument.invisible ?? false) ? <Divider/> : null
                      );
                    case 'number':
                      return (
                        <NumberInput
                          label={argument.label}
                          key={argument.value}
                          value={argument.default ?? 0}
                          onChange={(value) => handleChange(action.value, argument.value, value)}
                        />
                      );
                    case 'text':
                        return (
                          <TextInput
                            key={argument.value}
                            label={argument.label}
                            value={trollStates[action.value][argument.value]}
                            onChange={(event) => handleChange(action.value, argument.value, event.currentTarget.value)}
                          />
                        );
                      case 'select':
                        return (
                          <Select
                            key={argument.value}
                            label={argument.label}
                            data={argument.options.map((option: any) => ({ value: option.value, label: option.label }))}
                            value={trollStates[action.value][argument.value] || argument.options.find((option: any) => option.selected)?.value}
                            onChange={(value) => handleChange(action.value, argument.value, value)}
                          />
                        );
                    default:
                      return null;
                  }
                })}
                <Button
                  uppercase
                  disabled={Object.values(trollStates[action.value]).some((val) => val === '')}
                  variant="light"
                  color="blue"
                  onClick={() => handleConfirm(action.value)}
                >Confirm</Button>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      ))}
      <Divider />
    </Stack>
  )
}

export default TrollMenu
